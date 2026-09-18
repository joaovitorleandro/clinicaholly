<template>
  <a class="brand-logo" href="#inicio" aria-label="Clínica Holly, início">
    <svg class="brand-symbol" viewBox="0 0 50 64" aria-hidden="true">
      <path d="M8 3Q28 32 8 61Q20 32 8 3M42 3Q22 32 42 61Q30 32 42 3" fill="currentColor" />
      <path d="m25 20 2.4 8.6L36 32l-8.6 2.4L25 44l-2.4-9.6L14 32l8.6-3.4Z" fill="currentColor" />
    </svg>
    <span class="brand-type"><span class="brand-category">Clínica</span><span class="brand-word">HOLLY</span></span>
  </a>
</template>

<style scoped>
.brand-logo{display:inline-flex;align-items:center;gap:12px;width:143px;flex-shrink:0;color:var(--ivory)}
.brand-symbol{height:46px;width:32px;color:#c4a16c}
.brand-type{display:flex;flex-direction:column;align-items:flex-start}
.brand-category{font-size:8px;letter-spacing:.24em;text-transform:uppercase;margin-left:3px;color:#ceb788}
.brand-word{font-family:var(--display);font-size:36px;line-height:1;letter-spacing:.025em}
@media(max-width:767px){.brand-logo{gap:8px;width:127px}.brand-symbol{height:37px;width:27px}.brand-word{font-size:31px}.brand-category{font-size:7px}}
</style>
