import { Page, Text, View, StyleSheet } from '@alexandernanberg/react-pdf-renderer'
import type { ResumeData, ExperienceItem, EducationItem, ProjectItem } from '@/types/resume'

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 10
  },
  name: {
    fontSize: 19,
    marginBottom: 4,
    textAlign: 'center'
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    fontSize: 10
  },
  section: {
    marginVertical: 12
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#4a90e2'
  },
  item: {
    marginBottom: 8
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    marginBottom: 2
  },
  itemSubHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 10,
    marginBottom: 4
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 8,
    fontSize: 10
  }
});

export default function PDFResume({ data }: { data: ResumeData }) {
  if (!data || !data.personalInfo) return null;

  return (
    <Page size="LETTER" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo.name}</Text>
        <View style={styles.contactInfo}>
          <Text>{[
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.linkedin,
            data.personalInfo.github
          ].filter(Boolean).join(' | ')}</Text>
        </View>
      </View>

      {data.sections?.map((section, sIndex) => (
        <View key={sIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          
          {section.items?.map((item, iIndex) => (
            <View key={iIndex} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text>{section.type === 'experience' ? 
                  (item as ExperienceItem).company : 
                  section.type === 'education' ? 
                  (item as EducationItem).institution :
                  item.title}</Text>
                <Text>{item.location}</Text>
              </View>
              
              <View style={styles.itemSubHeader}>
                <Text>{section.type === 'experience' ? 
                  (item as ExperienceItem).position :
                  section.type === 'education' ? 
                  (item as EducationItem).degree :
                  (item as ProjectItem).skills}</Text>
                <Text>{item.dateRange}</Text>
              </View>

              {item.accomplishments?.map((acc, aIndex) => (
                <View key={aIndex} style={styles.bulletPoint}>
                  <Text>• {acc}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ))}
    </Page>
  );
}