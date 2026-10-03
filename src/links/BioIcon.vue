<script setup lang="ts">
defineProps<{ name: 'whatsapp' | 'catalog' | 'site' | 'instagram' | 'pin' }>()
</script>

<template>
  <svg class="bio-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <template v-if="name === 'whatsapp'">
      <path d="M4.2 19.8 5.3 16A8.2 8.2 0 1 1 8.4 19z" />
      <path d="M9.1 8.2c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.6.7c-.1.1-.2.3-.1.5.6 1.2 1.6 2.2 2.8 2.8.2.1.4 0 .5-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.2.7-.5.9-.6.4-1.4.6-2.2.4-2.6-.7-4.7-2.8-5.4-5.4-.2-.9 0-1.6.4-2.2z" />
    </template>
    <template v-else-if="name === 'catalog'">
      <path d="M12 6.5C10.4 5.2 8 4.7 4.5 5v13c3.5-.3 5.9.2 7.5 1.5 1.6-1.3 4-1.8 7.5-1.5V5c-3.5-.3-5.9.2-7.5 1.5z" />
      <path d="M12 6.5v13" />
    </template>
    <template v-else-if="name === 'site'">
      <rect x="3.5" y="5" width="17" height="14" rx="1.5" />
      <path d="M3.5 9h17M6.5 7h.01M8.5 7h.01" />
    </template>
    <template v-else-if="name === 'instagram'">
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <path d="M16.6 7.4h.01" />
    </template>
    <template v-else>
      <path d="M12 20.5s6-5.4 6-10.5a6 6 0 1 0-12 0c0 5.1 6 10.5 6 10.5z" />
      <circle cx="12" cy="10" r="2.2" />
    </template>
  </svg>
</template>

<style scoped>
.bio-icon{display:block;width:1em;height:1em;flex:none}
</style>
