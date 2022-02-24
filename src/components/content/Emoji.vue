<template>
<div class='Emoji'>
  <EmojiPicker 
  :disable-sticky-group-names="true" 
  :disable-skin-tones="true" 
  :hide-search="true" 
  :hide-group-names="true"
  :native="true" 
  @select="onSelectEmoji" />
</div>
</template>

<script>
// import picker compopnent
import EmojiPicker from 'vue3-emoji-picker'

// import css
import '../../../node_modules/vue3-emoji-picker/dist/style.css'
export default {
  name: 'Emoji',
  components: {
    EmojiPicker
  },
  methods: {
    onSelectEmoji(emoji) {
      this.$emit('hemoji',emoji);
    }
  }
}
</script>

<style scoped lange="less">
.Emoji{
  width: 100%;
}
:deep(.v3-emoji-picker){
  width: 100%;
}
:deep(.v3-footer){
  display: none;
}
:deep(.v3-emojis button){
  margin-top: 10px !important;
}
</style>
