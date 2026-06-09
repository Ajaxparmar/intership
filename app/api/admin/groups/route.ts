import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [groups, teamLeads, students] = await Promise.all([
      prisma.studentGroup.findMany({
        include: {
          teamLead: { select: { id: true, fullName: true, phone: true } },
          students: { select: { id: true, fullName: true, phone: true, courseName: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.student.findMany({
        where: { user: { role: "TEAMLEAD" } },
        select: { id: true, fullName: true, phone: true },
        orderBy: { fullName: "asc" },
      }),
      prisma.student.findMany({
        select: { id: true, fullName: true, phone: true, courseName: true, groupId: true, user: { select: { role: true } } },
        orderBy: { fullName: "asc" },
      }),
    ]);
    return NextResponse.json({ success: true, groups, teamLeads, students });
  } catch (error) {
    console.error("List groups error:", error);
    return NextResponse.json({ error: "Failed to load groups." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name?.trim() || !data.teamLeadId) {
      return NextResponse.json({ error: "Group name and team lead are required." }, { status: 400 });
    }
    const teamLead = await prisma.student.findFirst({
      where: { id: data.teamLeadId, user: { role: "TEAMLEAD" } },
      select: { id: true },
    });
    if (!teamLead) {
      return NextResponse.json({ error: "Select a student who has the team lead role." }, { status: 400 });
    }

    const group = await prisma.studentGroup.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || undefined,
        teamLeadId: data.teamLeadId,
      },
      include: { teamLead: { select: { id: true, fullName: true, phone: true } }, students: true },
    });
    return NextResponse.json({ success: true, group }, { status: 201 });
  } catch (error) {
    console.error("Create group error:", error);
    return NextResponse.json({ error: "Could not create group. Group names must be unique." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    if (!data.studentId) {
      return NextResponse.json({ error: "Student is required." }, { status: 400 });
    }

    const student = await prisma.student.update({
      where: { id: data.studentId },
      data: { groupId: data.groupId || null },
      include: { group: true },
    });
    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error("Assign group error:", error);
    return NextResponse.json({ error: "Could not assign student to group." }, { status: 500 });
  }
}
