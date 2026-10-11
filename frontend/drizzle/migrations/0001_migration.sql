create or replace function public.admin_profiles()
returns setof public.profiles language sql stable security definer set search_path = public
as $$ select p.* from public.profiles p where exists (select 1 from public.user_roles r where r.user_id = p.id and r.role = 'admin') order by p.created_at $$;
grant execute on function public.admin_profiles() to anon, authenticated;