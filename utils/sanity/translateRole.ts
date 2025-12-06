

const roleMap = {
    'boardLeader': 'Styreleder',
    'subjectLeader': 'Fagansvarlig',
    'internalLeader': 'Internsjef',
    'externalLeader': 'Eksternsjef',
    'internalCoordinator': 'Internkoordinator',
    'externalCoordinator': 'Eksternkoordinator',
    'committeeLeader': 'Komiteansvarlig',
    'instructorLeader': 'Instruktøransvarlig',
    'financialLeader': 'Økonomiansvarlig',
    'marketingLeader': 'Markedsføringsansvarlig',
    'extraLeader': 'Markøransvarlig',
    'sponsorLeader': 'Sponsoransvarlig',
    'equipmentLeader': 'Utstyransvarlig',
    'secretary': 'Sekretær',
    'mentorLeader': 'Mentorleder',
}
export const translateRole = (role: keyof typeof roleMap) => roleMap[role] || role