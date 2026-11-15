<script setup lang="ts">
  import BaseButton from '~/components/UI/buttons/BaseButton.vue';

  withDefaults(
    defineProps<{
      message?: string;
      confirmLabel?: string;
      cancelLabel?: string;
      confirmVariant?: 'primary' | 'danger';
    }>(),
    {
      message: 'Подтвердите действие',
      confirmLabel: 'Продолжить',
      cancelLabel: 'Отменить',
      confirmVariant: 'primary',
    },
  );

  const emit = defineEmits<{ confirm: []; cancel: [] }>();
  const dialog = useTemplateRef<HTMLDialogElement>('dialog');
  const messageId = useId();

  onMounted(() => dialog.value?.showModal());

  const finish = (result: 'confirm' | 'cancel') => {
    dialog.value?.close();
    if (result === 'confirm') emit('confirm');
    else emit('cancel');
  };

  const moveFocus = () => {
    const buttons = dialog.value?.querySelectorAll('button');
    if (!buttons) return;

    const [cancelButton, confirmButton] = buttons;
    const nextButton =
      document.activeElement === cancelButton ? confirmButton : cancelButton;
    nextButton?.focus();
  };
</script>

<template>
  <dialog
    ref="dialog"
    class="confirm-dialog"
    :aria-labelledby="messageId"
    @cancel.prevent="finish('cancel')"
    @keydown.stop
    @keydown.tab.prevent="moveFocus"
  >
    <p :id="messageId" class="confirm-dialog__message">{{ message }}</p>

    <div class="confirm-dialog__actions">
      <BaseButton variant="secondary" autofocus @click="finish('cancel')">
        {{ cancelLabel }}
      </BaseButton>
      <BaseButton :variant="confirmVariant" @click="finish('confirm')">
        {{ confirmLabel }}
      </BaseButton>
    </div>
  </dialog>
</template>

<style scoped lang="scss">
  .confirm-dialog {
    inline-size: min(420px, calc(100% - 32px));
    max-block-size: calc(100dvh - 32px);
    margin: auto;
    padding: clamp(20px, 5vw, 32px);
    border: 1px solid var(--color-border);
    border-radius: 24px;
    background: var(--color-surface);
    color: var(--color-text);
    box-shadow: 0 16px 60px
      color-mix(in srgb, var(--color-shadow) 26%, transparent);

    &::backdrop {
      background: rgb(24 19 43 / 0.56);
    }

    &__message {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      overflow-wrap: anywhere;
    }

    &__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-block-start: 24px;

      > :deep(button) {
        flex: 1 1 110px;
      }

      > :deep(button:focus-visible) {
        outline: 2px solid var(--color-link);
        outline-offset: 3px;
      }
    }
  }
</style>
