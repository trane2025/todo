<template>
  <button :type="type" class="base-button" :class="`base-button--${variant}`">
    <slot />
  </button>
</template>

<script setup lang="ts">
  interface Props {
    type?: 'button' | 'submit'
    variant?: 'primary' | 'secondary' | 'danger'
  }

  withDefaults(defineProps<Props>(), {
    type: 'button',
    variant: 'primary',
  })
</script>

<style scoped lang="scss">
  .base-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-inline-size: 44px;
    min-block-size: 48px;
    max-inline-size: 100%;
    padding: 10px 18px;
    border: 1px solid transparent;
    border-radius: 16px;
    font-weight: 600;
    line-height: 1.25;
    text-align: center;
    overflow-wrap: anywhere;
    cursor: pointer;

    &--primary {
      background: var(--color-primary);
      color: var(--color-on-primary);
    }

    &--secondary {
      border-color: var(--color-border);
      background: #e2e1fc;
      color: var(--color-text);
    }

    &--danger {
      background: #ffd1e8;
      color: #94104d;
    }

    &:enabled:hover {
      filter: brightness(0.95);
    }

    &:enabled:active {
      filter: brightness(0.9);
    }

    &:disabled {
      opacity: 0.55;
      cursor: default;
    }

    :slotted(svg) {
      flex: none;
      inline-size: 20px;
      block-size: 20px;
    }
  }

  :root[data-theme='dark'] .base-button--secondary {
    background: #4c446e;
  }
</style>
