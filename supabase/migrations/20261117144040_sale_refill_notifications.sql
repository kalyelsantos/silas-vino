-- Cada venda registada cria uma reposição, na mesma transação do movimento.
create table public.refill_requests (
  sale_id bigint primary key references public.stock_movements (id),
  completed_at timestamptz
);

create index refill_requests_pending_idx
  on public.refill_requests (sale_id) where completed_at is null;

alter table public.refill_requests enable row level security;
revoke all on public.refill_requests from public, anon, authenticated;
grant select on public.refill_requests to authenticated;
create policy "approved staff can read refill requests"
  on public.refill_requests for select to authenticated
  using ((select private.is_approved()));

create function private.queue_sale_refill()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  insert into public.refill_requests (sale_id) values (new.id);
  return new;
end;
$$;
revoke all on function private.queue_sale_refill() from public, anon, authenticated;

create trigger queue_sale_refill
  after insert on public.stock_movements
  for each row when (new.movement_type = 'sale' and new.actor_id is not null)
  execute function private.queue_sale_refill();

create function private.complete_sale_refill(p_sale_id bigint)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_completed_at timestamptz;
  v_wine_id text;
  v_quantity integer;
  v_seller text;
begin
  if (select auth.uid()) is null or not private.is_approved() then
    raise exception 'Conta não autorizada.' using errcode = '42501';
  end if;

  select request.completed_at, sale.wine_id, sale.quantity, sale.actor_name
    into v_completed_at, v_wine_id, v_quantity, v_seller
  from public.refill_requests as request
  join public.stock_movements as sale on sale.id = request.sale_id
  where request.sale_id = p_sale_id
  for update of request;

  if not found then raise exception 'Pedido de reposição não encontrado.'; end if;
  if v_completed_at is not null then return false; end if;

  -- A validação, transferência de stock e auditoria seguem a operação existente.
  perform private.do_movement(
    v_wine_id, 'refill', v_quantity, 'fridge', null,
    pg_catalog.format('Venda de %s · movimento #%s', v_seller, p_sale_id)
  );

  update public.refill_requests set completed_at = now() where sale_id = p_sale_id;
  return true;
end;
$$;

create function public.confirm_refill(p_sale_id bigint)
returns boolean language sql security invoker set search_path = '' as $$
  select private.complete_sale_refill(p_sale_id);
$$;

revoke all on function private.complete_sale_refill(bigint) from public, anon, authenticated;
revoke all on function public.confirm_refill(bigint) from public, anon, authenticated;
grant execute on function private.complete_sale_refill(bigint) to authenticated;
grant execute on function public.confirm_refill(bigint) to authenticated;

alter publication supabase_realtime add table public.refill_requests;
notify pgrst, 'reload schema';
