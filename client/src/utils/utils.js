import M from "materialize-css";

export function errorToast(msg) {
  return M.toast({
    html: msg,
    classes: "#ff1744 red accent-3",
  });
}

export function successToast(msg) {
  return M.toast({
    html: msg,
    classes: "#1de9b6 teal accent-3",
  });
}
