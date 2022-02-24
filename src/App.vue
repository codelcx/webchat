<template>
  <div id="app">
    <person></person>
  </div>
</template>
<script>
import Chat from 'views/chat/Chat'
import Person from 'views/person/Person'
export default {
  components: {
    Chat,
    Person
  },
};
</script>
<style>
#app{
  width: 1000px;
  height: 100%;
  position: relative;
  left:50%;
  transform: translateX(-50%);
}
</style>
