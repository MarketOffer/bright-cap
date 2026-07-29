alter table public.investor_statement_financials drop constraint if exists assets_rounded;
alter table public.investor_statement_financials
  add constraint assets_rounded check (
    net_assets_band is null
    or net_assets_band % 100000 = 0
    or net_assets_band = 250000  -- the statutory threshold itself
  );