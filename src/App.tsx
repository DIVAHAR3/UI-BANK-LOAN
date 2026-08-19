import { useState } from "react";
import { BackgroundDecor } from "./components/BackgroundDecor";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { ContractSummary } from "./components/ContractSummary";
import { AmortizationOverview } from "./components/AmortizationOverview";
import { FinancialSummary } from "./components/FinancialSummary";
import { BookingItems } from "./components/BookingItems";
import { ComponentsPanel } from "./components/ComponentsPanel";
import { RatesPanel } from "./components/RatesPanel";
import { SchedulesPanel } from "./components/SchedulesPanel";
import { CollateralPanel } from "./components/CollateralPanel";
import { CoApplicantPanel } from "./components/CoApplicantPanel";
import { EntriesPanel } from "./components/EntriesPanel";
import { DueTodayPanel } from "./components/DueTodayPanel";
import { AuditPanel } from "./components/AuditPanel";
import {
  RateChangeCard,
  ProcessingCard,
  RecomputationCard,
  QuickInfoCard,
} from "./components/ConfigCards";
import { Tabs } from "./components/Tabs";
import { PageFooterBar } from "./components/PageFooterBar";
import { Card } from "./components/Card";
import { Inbox } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("General");

  return (
    <div className="min-h-screen w-full bg-page">
      <BackgroundDecor />
      <Sidebar />

      <main className="px-4 py-8 sm:px-6 lg:ml-20 lg:px-10">
        <Header />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <ContractSummary />

          <AmortizationOverview />
          <FinancialSummary />

          <div className="lg:col-span-2">
            <Tabs active={activeTab} onChange={setActiveTab} />
          </div>

          {activeTab === "General" && (
            <>
              <div className="lg:col-span-2">
                <BookingItems />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
                <RateChangeCard />
                <ProcessingCard />
                <RecomputationCard />
                <QuickInfoCard />
              </div>
            </>
          )}

          {activeTab === "Component" && (
            <div className="lg:col-span-2">
              <ComponentsPanel />
            </div>
          )}

          {activeTab === "Rates" && (
            <div className="lg:col-span-2">
              <RatesPanel />
            </div>
          )}

          {activeTab === "Schedules" && (
            <div className="lg:col-span-2">
              <SchedulesPanel />
            </div>
          )}

          {activeTab === "Collateral" && (
            <div className="lg:col-span-2">
              <CollateralPanel />
            </div>
          )}

          {activeTab === "Co-Applicant" && (
            <div className="lg:col-span-2">
              <CoApplicantPanel />
            </div>
          )}

          {activeTab === "Entries" && (
            <div className="lg:col-span-2">
              <EntriesPanel />
            </div>
          )}

          {activeTab === "Due Today" && (
            <div className="lg:col-span-2">
              <DueTodayPanel />
            </div>
          )}

          {activeTab === "Audit" && (
            <div className="lg:col-span-2">
              <AuditPanel />
            </div>
          )}

          {activeTab !== "General" &&
            activeTab !== "Component" &&
            activeTab !== "Rates" &&
            activeTab !== "Schedules" &&
            activeTab !== "Collateral" &&
            activeTab !== "Co-Applicant" &&
            activeTab !== "Entries" &&
            activeTab !== "Due Today" &&
            activeTab !== "Audit" && (
            <div className="lg:col-span-2">
              <EmptyTabState label={activeTab} />
            </div>
          )}

          <div className="lg:col-span-2">
            <PageFooterBar />
          </div>
        </div>
      </main>
    </div>
  );
}

function EmptyTabState({ label }: { label: string }) {
  return (
    <Card delay={0} hover={false}>
      <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-mint text-emerald-strong">
          <Inbox size={22} />
        </span>
        <div>
          <div className="text-base font-extrabold text-ink">No {label.toLowerCase()} data yet</div>
          <div className="mt-1 text-sm text-ink-faint">
            This section hasn&apos;t been populated for this contract.
          </div>
        </div>
      </div>
    </Card>
  );
}

export default App;
