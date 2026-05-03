import type { PayrollRecord } from "@/lib/types";

export function PayslipCard({ record }: { record: PayrollRecord }) {
  return (
    <section className="panel overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">
        <div className="text-lg font-bold text-ink">Payslip</div>
        <div className="text-sm text-slate-500">Month {record.month}, {record.year}</div>
      </div>

      <div className="grid gap-4 p-5 md:grid-cols-2">
        <Info label="Employee" value={`${record.employee_code} - ${record.full_name}`} />
        <Info label="Department" value={record.department || "-"} />
        <Info label="Designation" value={record.designation || "-"} />
        <Info label="Generated At" value={new Date(record.generated_at).toLocaleString()} />
      </div>

      <div className="grid border-t border-slate-100 md:grid-cols-2">
        <div className="p-5">
          <div className="mb-3 font-semibold text-ink">Earnings</div>
          <Line label="Gross Salary" value={record.gross_salary} strong />
        </div>
        <div className="border-t border-slate-100 p-5 md:border-l md:border-t-0">
          <div className="mb-3 font-semibold text-ink">Deductions</div>
          <Line label="Attendance Deduction" value={record.attendance_deduction} />
          <Line label="Total Deductions" value={record.total_deductions} strong />
        </div>
      </div>

      <div className="border-t border-slate-100 bg-blue-50 px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600">Net Salary</span>
          <span className="text-2xl font-bold text-brand">Rs. {record.net_salary}</span>
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-ink">{value}</div>
    </div>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between border-b border-slate-100 py-2 text-sm ${strong ? "font-semibold" : ""}`}>
      <span>{label}</span>
      <span>Rs. {value}</span>
    </div>
  );
}
