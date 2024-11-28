export interface PopoverOption {
  type: "switch" | "button";
  label: string;
  value: boolean;
  key: "showNames" | "refreshConfirm" | "downloadImg";
  function?: Function;
}
