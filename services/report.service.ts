import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { taskStatusLabels } from "@/utils/constants";

interface ReportData {
  project: any;
  tasks: any[];
}

export const generateProjectReport = (data: ReportData) => {
  const { project, tasks } = data;
  const doc = new jsPDF() as any;

  // --- Styles & Palette ---
  const primaryColor: [number, number, number] = [79, 70, 229]; // Indigo-600
  const secondaryColor: [number, number, number] = [100, 116, 139]; // Slate-500
  
  // --- Header ---
  doc.setFillColor(248, 250, 252); // bg-slate-50
  doc.rect(0, 0, 210, 40, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("RAPPORT DE PROJET", 20, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text(`Généré le : ${new Date().toLocaleDateString("fr-FR")}`, 150, 25);

  // --- Project Info ---
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(project.name.toUpperCase(), 20, 55);
  
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(0.5);
  doc.line(20, 58, 60, 58);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text("Description :", 20, 70);
  
  const splitDescription = doc.splitTextToSize(project.description || "Aucune description fournie.", 170);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text(splitDescription, 20, 78);

  let currentY = 78 + (splitDescription.length * 6);

  // --- Stats Summary ---
  doc.setFillColor(241, 245, 249); // bg-slate-100
  doc.roundedRect(20, currentY, 170, 25, 3, 3, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.text("STATUT", 30, currentY + 10);
  doc.text("DÉBUT", 75, currentY + 10);
  doc.text("FIN", 120, currentY + 10);
  doc.text("MEMBRES", 160, currentY + 10);

  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(project.status === "DONE" ? "TERMINÉ" : project.status, 30, currentY + 18);
  doc.text(project.startDate || "-", 75, currentY + 18);
  doc.text(project.endDate || "-", 120, currentY + 18);
  doc.text(`${project.members?.length || 0}`, 160, currentY + 18);

  currentY += 40;

  // --- Members List ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Équipe du projet", 20, currentY);
  currentY += 10;

  const memberRows = (project.members || []).map((m: any) => [
    m.userName || m.userId,
    m.roleInProject === "PROJECT_MANAGER" ? "Chef de projet" : m.roleInProject || "Membre"
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Nom", "Rôle"]],
    body: memberRows,
    theme: "striped",
    headStyles: { fillColor: primaryColor },
    margin: { left: 20, right: 20 }
  });

  currentY = (doc as any).lastAutoTable.finalY + 20;

  // --- Tasks Table ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Détail des tâches", 20, currentY);
  currentY += 10;

  const taskRows = tasks.map((t: any) => [
    t.title,
    taskStatusLabels[t.status as keyof typeof taskStatusLabels] || t.status,
    t.priority || "MEDIUM",
    t.dueDate || "-"
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [["Tâche", "Statut", "Priorité", "Échéance"]],
    body: taskRows,
    theme: "grid",
    headStyles: { fillColor: primaryColor },
    styles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 20, right: 20 }
  });

  // --- Footer ---
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text(`Page ${i} sur ${pageCount} - CNI Projets Management`, 105, 290, { align: "center" });
  }

  // Save PDF
  doc.save(`Rapport_${project.name.replace(/\s+/g, '_')}.pdf`);
};
