import * as Excel from "exceljs";
import { format } from "date-fns";
import { ProjectTask } from "@/lib/schema/TaskSchema";

export interface ExcelColumn {
  header: string;
  key: string;
  width: number;
}

export class ExcelExportService {
  private workbook: Excel.Workbook;
  private worksheet: Excel.Worksheet;

  constructor() {
    this.workbook = new Excel.Workbook();
    this.worksheet = this.workbook.addWorksheet("Tasks");
  }

  private setupColumns(columns: ExcelColumn[]) {
    this.worksheet.columns = columns;

    // Style the header row
    const headerRow = this.worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE9ECEF" },
    };
  }

  private addStatusFormatting() {
    this.worksheet
      .getColumn("status")
      .eachCell({ includeEmpty: false }, (cell, rowNumber) => {
        if (rowNumber > 1) {
          switch (cell.value) {
            case "DONE":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFE8F5E9" },
              };
              break;
            case "IN_PROGRESS":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFF3E0" },
              };
              break;
            case "TO_DO":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFE3F2FD" },
              };
              break;
            case "CANCELED":
              cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFFFEBEE" },
              };
              break;
          }
        }
      });
  }

  private addPriorityFormatting() {
    this.worksheet
      .getColumn("priority")
      .eachCell({ includeEmpty: false }, (cell, rowNumber) => {
        if (rowNumber > 1) {
          switch (cell.value) {
            case "HIGH":
              cell.font = { color: { argb: "FFDC3545" } };
              break;
            case "MEDIUM":
              cell.font = { color: { argb: "FFFD7E14" } };
              break;
            case "LOW":
              cell.font = { color: { argb: "FF0D6EFD" } };
              break;
          }
        }
      });
  }

  private addBorders() {
    this.worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });
  }

  private setupWorksheetOptions(columnCount: number) {
    // Add auto-filter
    this.worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: columnCount },
    };

    // Freeze the header row
    this.worksheet.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];
  }

  async exportTasks(tasks: ProjectTask[]): Promise<Blob> {
    const columns: ExcelColumn[] = [
      { header: "Task", key: "name", width: 30 },
      { header: "Status", key: "status", width: 15 },
      { header: "Priority", key: "priority", width: 15 },
      { header: "Assigned To", key: "assignedTo", width: 20 },
      { header: "Due Date", key: "dueDate", width: 15 },
    ];

    this.setupColumns(columns);

    const rows = tasks.map((task) => ({
      name: task.name,
      status: task.status,
      priority: task.priority,
      assignedTo: task.member?.user?.name ?? "Unassigned",
      dueDate: format(task.dueDate, "dd/MM/yyyy"),
    }));

    this.worksheet.addRows(rows);

    this.addStatusFormatting();
    this.addPriorityFormatting();
    this.addBorders();
    this.setupWorksheetOptions(columns.length);

    const buffer = await this.workbook.xlsx.writeBuffer();
    return new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }
}

export const downloadExcel = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
