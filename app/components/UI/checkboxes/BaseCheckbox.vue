<template>
  <span
    class="base-checkbox"
    :class="{ 'base-checkbox--checked': checked }"
    :role="readOnly ? 'img' : undefined"
    :aria-label="readOnly ? label : undefined"
  >
    <input
      v-if="!readOnly"
      v-model="checked"
      class="base-checkbox__input"
      type="checkbox"
      :disabled="disabled"
      :aria-label="label"
    />
    <span class="base-checkbox__mark" aria-hidden="true"></span>
  </span>
</template>

<script setup lang="ts">
  defineProps<{
    label: string;
    readOnly?: boolean;
    disabled?: boolean;
  }>();

  const checked = defineModel<boolean>('checked', { required: true });
</script>

<style scoped lang="scss">
  .base-checkbox {
    position: relative;
    display: grid;
    inline-size: 28px;
    block-size: 20px;

    &__mark {
      display: grid;
      place-items: center;
      border: 2px solid var(--checkbox-border-color, var(--color-link));
      border-radius: 8px;
      pointer-events: none;
    }

    &--checked &__mark {
      border-color: var(--color-primary);
      background: var(--color-primary);

      &::after {
        inline-size: 6px;
        block-size: 11px;
        border: solid var(--color-on-primary);
        border-width: 0 2px 2px 0;
        content: '';
        transform: translateY(-1px) rotate(45deg);
      }
    }

    &__input {
      position: absolute;
      inset: 0;
      inline-size: 100%;
      block-size: 100%;
      margin: 0;
      opacity: 0;
      cursor: pointer;
    }

    &__input:disabled {
      cursor: default;
    }

    &__input:disabled + &__mark {
      opacity: 0.55;
    }

    &__input:focus-visible + &__mark {
      outline: 3px solid var(--color-link);
      outline-offset: 3px;
    }
  }
</style>
