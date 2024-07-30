export function cleanMongooseDoc(doc: any): any {
  const obj = doc.toObject();
  delete obj.__v;
  delete obj.password;
  return obj;
}
