import Vue from 'vue';

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    $Bus: Bus;
    $store: PlainObject;
    $Sendmsg2main(cmd: string, params: unknown = null): Promise<PlainObject>;
  }
}

type BusChannel = {
  'row-edit': (e: number) => void;
  'row-copy': (e: number) => void;
  'row-del': (e: number) => void;
  'new-sql': (e: PlainObject) => void;
  'table-select': (e: string) => void;
  'table-update': (e: string) => void;
  'table-insert': (e: string) => void;
  'table-delete': (e: string) => void;
};

interface Bus extends Vue {
  $on<T extends keyof BusChannel>(event: T, callback: BusChannel[T]): this;
  $once<T extends keyof BusChannel>(event: T, callback: BusChannel[T]): this;
  $off<T extends keyof BusChannel>(event: T, callback: BusChannel[T]): this;
  $emit<T extends keyof BusChannel>(event: T, ...args: unknown[]): this;
}
