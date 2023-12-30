export function translateToPtBR(msg: string) {
  return msg
    .replace('must be a', 'deve ser uma')
    .replace(
      'conforming to the specified constraints',
      'conforme as regras especificadas',
    )
    .replace('valid ISO 8601 date string', 'sequência de data ISO 8601 válida');
}
