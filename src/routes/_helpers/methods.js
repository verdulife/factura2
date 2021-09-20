export function ADD(method, body) {
  return {
    method: method.toUpperCase(),
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };
}

export function DEL() {
  return {
    method: "DELETE",
  };
}
