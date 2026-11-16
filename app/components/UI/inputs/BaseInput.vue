<script setup lang="ts">
  interface Props {
    label: string;
    hideLabel?: boolean;
    placeholder?: string;
  }

  const props = defineProps<Props>();
  const value = defineModel<string>({ required: true });
  const inputId = useId();
</script>

<template>
  <div class="base-input">
    <label
      :for="inputId"
      class="base-input__label"
      :class="{ 'base-input__label--hidden': props.hideLabel }"
    >
      {{ props.label }}
    </label>
    <input
      :placeholder="props.placeholder"
      :id="inputId"
      v-model="value"
      class="base-input__field"
      type="text"
    />
  </div>
</template>

<style scoped lang="scss">
  .base-input {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-inline-size: 0;
  }

  .base-input__label {
    color: var(--color-text);
    font-weight: 500;
    line-height: 1.25;
    user-select: none;

    &--hidden {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
    }
  }

  .base-input__field {
    inline-size: 100%;
    min-inline-size: 0;
    padding: 8px 18px;
    border: 1px solid var(--color-border);
    border-radius: 12px;
    background: color-mix(
      in srgb,
      var(--color-surface),
      var(--color-border) 20%
    );
    color: var(--input-text-color, var(--color-text));
    text-decoration: var(--input-text-decoration, none);

    &:focus {
      outline: 1px solid transparent;
      box-shadow: 0 0 0 3px
        color-mix(in srgb, var(--color-link) 10%, transparent);
    }
  }
</style>
