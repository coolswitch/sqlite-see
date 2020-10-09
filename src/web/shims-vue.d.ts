import Vue from 'vue'

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
      $Bus: Bus;
      $store: PlainObject;
  }
}

type channelEvent = "row-edit" | "row-copy";
type channelFn = (e: number) => void;

interface Bus extends Vue {
    $on(event: channelEvent, callback: channelFn): this;
    $once(event: channelEvent, callback: channelFn): this;
    $off(event?: channelEvent, callback?: channelFn): this;
    $emit(event: channelEvent, ...args: any[]): this;
}