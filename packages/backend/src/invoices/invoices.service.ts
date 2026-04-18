import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPriceCents: number;
}

export interface Invoice {
  id: string;
  number: number;
  customerEmail: string;
  customerName: string;
  items: InvoiceLineItem[];
  vatPercent: number;
  subtotalCents: number;
  vatCents: number;
  totalCents: number;
  status: 'draft' | 'sent' | 'paid';
  createdAt: string;
}

/**
 * In-memory store so the sample runs without any real DB. When ACE
 * provisions a Client Application with Cloud SQL, swap this for a Prisma
 * implementation that reads `process.env.DATABASE_URL` — the rest of the
 * app doesn't need to change.
 */
@Injectable()
export class InvoicesService {
  private readonly invoices = new Map<string, Invoice>();
  private counter = 1000;

  list(): Invoice[] {
    return Array.from(this.invoices.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  get(id: string): Invoice {
    const inv = this.invoices.get(id);
    if (!inv) throw new NotFoundException(`invoice ${id} not found`);
    return inv;
  }

  create(input: {
    customerEmail: string;
    customerName: string;
    items: InvoiceLineItem[];
    vatPercent?: number;
  }): Invoice {
    const vatPercent = input.vatPercent ?? 0;
    const subtotalCents = input.items.reduce(
      (sum, i) => sum + i.quantity * i.unitPriceCents,
      0,
    );
    const vatCents = Math.round(subtotalCents * (vatPercent / 100));
    const inv: Invoice = {
      id: randomUUID(),
      number: ++this.counter,
      customerEmail: input.customerEmail,
      customerName: input.customerName,
      items: input.items,
      vatPercent,
      subtotalCents,
      vatCents,
      totalCents: subtotalCents + vatCents,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };
    this.invoices.set(inv.id, inv);
    return inv;
  }

  markSent(id: string): Invoice {
    const inv = this.get(id);
    inv.status = 'sent';
    return inv;
  }

  markPaid(id: string): Invoice {
    const inv = this.get(id);
    inv.status = 'paid';
    return inv;
  }
}
