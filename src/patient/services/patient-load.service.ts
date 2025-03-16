import { PatientsExcelHeaderMap } from '@/patient/constants/patient-load.constants';
import { Patient } from '@/patient/entities/patient.entity';
import { InvalidExcelHeaderException } from '@/patient/exceptions/invalid-excel-header.exception';
import { Injectable } from '@nestjs/common';
import * as xlsx from 'xlsx';

@Injectable()
export class PatientLoadService {
  fromExcel(file: Express.Multer.File): {
    patients: Patient[];
    count: number;
    errorCount: number;
    totalCount: number;
  } {
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const firstRow = xlsx.utils.sheet_to_json(sheet)[0];
    const originHeaders = Object.keys(firstRow);

    if (!this.isValidHeader(originHeaders)) {
      throw new InvalidExcelHeaderException(
        originHeaders,
        Object.values(PatientsExcelHeaderMap),
      );
    }

    const rows = xlsx.utils.sheet_to_json<Partial<Patient>>(sheet, {
      header: Object.keys(PatientsExcelHeaderMap),
      range: 1,
      raw: false,
    });

    return this.processRows(rows);
  }

  processRows(rows: Partial<Patient>[]): {
    patients: Patient[];
    count: number;
    errorCount: number;
    totalCount: number;
  } {
    const errorRows: Partial<Patient>[] = [];
    const patients: Patient[] = [];

    for (const row of rows) {
      const { name, phoneNumber, ssn, chartNumber, address, memo } = row;

      if (
        !this.isValidName(name) ||
        !this.isValidPhoneNumber(phoneNumber) ||
        !this.isValidSSN(ssn)
      ) {
        errorRows.push(row);
        continue;
      }

      const formattedPhoneNumber = this.formatPhoneNumber(phoneNumber);
      const formattedSSN = this.formatSSN(ssn);

      patients.push({
        name,
        phoneNumber: formattedPhoneNumber,
        ssn: formattedSSN,
        chartNumber,
        address,
        memo,
      } as Patient);
    }

    return {
      patients,
      count: patients.length,
      errorCount: errorRows.length,
      totalCount: rows.length,
    };
  }

  isValidHeader(originHeaders: string[]): boolean {
    const headers = Object.values(PatientsExcelHeaderMap);
    if (originHeaders.length !== headers.length) {
      return false;
    }

    return headers.every((header, i) => header === originHeaders[i]);
  }

  isValidName(name: string | undefined): boolean {
    if (!name || name.length > 16) {
      return false;
    }

    return true;
  }

  isValidPhoneNumber(phoneNumber: string | undefined): boolean {
    if (!phoneNumber) {
      return false;
    }
    return /^010[-]?\d{4}[-]?\d{4}$/.test(phoneNumber);
  }

  formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber.includes('-')) {
      return phoneNumber;
    }

    return phoneNumber.replace(/-/g, '');
  }

  isValidSSN(ssn: string | undefined): boolean {
    if (!ssn) {
      return false;
    }

    return (
      /^\d{6}$/.test(ssn) ||
      /^\d{6}[-]?\d{7}$/.test(ssn) ||
      /^\d{6}[-]\d{1}\*{6}$/.test(ssn)
    );
  }

  formatSSN(ssn: string): string {
    const mask = '******';
    const yyyymmdd = ssn.slice(0, 6);

    if (ssn.length === 6) {
      return `${yyyymmdd}-0${mask}`;
    }

    if (ssn.length === 13) {
      const genderNumber = ssn.at(yyyymmdd.length + 1);
      return `${yyyymmdd}-${genderNumber}${mask}`;
    }

    return `${ssn.slice(0, 8)}${mask}`;
  }
}
