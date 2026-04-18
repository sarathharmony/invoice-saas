import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InvoicesService, InvoiceLineItem } from './invoices.service';

interface CreateInvoiceBody {
  customerEmail: string;
  customerName: string;
  items: InvoiceLineItem[];
  vatPercent?: number;
}

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoices: InvoicesService) {}

  @Get()
  list() {
    return this.invoices.list();
  }

  @Post()
  create(@Body() body: CreateInvoiceBody) {
    return this.invoices.create(body);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.invoices.get(id);
  }

  @Post(':id/send')
  send(@Param('id') id: string) {
    return this.invoices.markSent(id);
  }

  @Post(':id/pay')
  pay(@Param('id') id: string) {
    return this.invoices.markPaid(id);
  }

  @Get('_meta/company')
  company() {
    return {
      name: process.env.COMPANY_NAME ?? 'Example Ltd.',
      address: process.env.COMPANY_ADDRESS ?? '',
    };
  }
}
