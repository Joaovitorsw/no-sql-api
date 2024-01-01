export function transformID(doc, ret) {
  const id = ret._id;
  delete ret._id;
  return {
    id,
    ...ret,
  };
}
