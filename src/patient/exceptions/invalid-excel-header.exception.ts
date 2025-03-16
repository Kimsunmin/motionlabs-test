import { UnprocessableEntityException } from '@nestjs/common';

export class InvalidExcelHeaderException extends UnprocessableEntityException {
  constructor(originHeaders: string[], headers: string[]) {
    super('엑셀 템플릿이 유효하지 않습니다.', {
      cause: new Error(),
      description: `${originHeaders.join(',')} 의 형식은 사용 할 수 없습니다.\n${Object.values(headers).join(',')} 의 형식으로 사용해야합니다.`,
    });
  }
}
