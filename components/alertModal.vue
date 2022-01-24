<template>
  <div class="alert-modal">
      <transition name="modal">
                <div class="modal-mask">
                    <div class="modal-wrapper">
                        <div class="modal-container">
                            <div class="modal-header">
                                <slot name="header">
                                    default header
                                </slot>
                            </div>
                            <hr style="border: 1px solid #dee2e6;" />
                            <div class="modal-body">
                                <slot name="body">
                                default body
                                </slot>
                            </div>
                            <div class="modal-footer">
                                <slot name="left-btn">
                                </slot>
                                <slot name="right-btn">
                                </slot>
                            </div>
                        </div>
                    </div>
                </div>
      </transition>
  </div>
</template>

<script>
export default {

}
</script>
