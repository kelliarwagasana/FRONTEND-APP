/** Shared borders & surfaces for login / register — matches dashboard & brand tokens */
export const authForm = {
  card: 'rounded-2xl border border-[#eadfdb] bg-white p-6 sm:p-7',
  label: 'text-sm font-semibold text-black',
  input:
    'mt-1.5 flex items-center gap-3 rounded-xl border border-[#eadfdb] bg-white px-4 py-2.5 transition-colors focus-within:border-[#f97316] focus-within:ring-2 focus-within:ring-[#f97316]/15',
  inputIcon: 'text-[#f97316]',
  secondaryButton:
    'mt-4 flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-[#eadfdb] bg-[#fff7ed] px-4 py-2.5 text-sm font-medium text-black/45',
  dividerLine: 'h-px flex-1 bg-[#eadfdb]',
  dividerText: 'text-xs font-medium uppercase tracking-wider text-black/45',
  error: 'rounded-xl border border-[#f97316]/35 bg-[#fff7ed] px-4 py-3 text-sm font-medium text-black',
  roleGroup: 'mt-4 grid grid-cols-2 gap-2 rounded-xl border border-[#eadfdb] bg-[#fff7ed]/60 p-1',
  submit:
    'mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#f97316] bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-black hover:bg-black',
  footer: 'mt-5 border-t border-[#eadfdb] pt-5 text-center text-sm font-medium text-black/60',
  signedInCard: 'rounded-2xl border border-[#eadfdb] bg-white p-8',
} as const
