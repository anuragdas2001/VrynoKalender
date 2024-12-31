import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import { IReport } from "../models/IReport";

class ReportStore {
  public reports: IReport[] = [];
  public selectedReport: IReport | null = null;
  public newReportName: string = "";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  public addReport(report: IReport) {
    this.reports.push(report);
  }

  public updateReport(id: string, data: IReport) {
    const reports = [...this.reports];
    this.reports = reports.map((report) => {
      if (report.id === id) {
        return data;
      } else return report;
    });
  }

  public importReports(reports: IReport[]) {
    this.reports = [];
    reports.forEach((instance) => {
      this.addReport(instance);
    });
  }

  public removeReport(id: string) {
    this.reports = this.reports.filter((i) => i.id !== id);
  }

  public setSelectedReport(report: IReport) {
    this.selectedReport = report;
  }

  public setNewReportName(reportName: string) {
    this.newReportName = reportName;
  }

  public getById(id: string) {
    return this.reports.find((i) => i.id === id);
  }
}

export const ReportStoreContext = createContext(new ReportStore());
