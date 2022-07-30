import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {RowData} from "../../../models/row-data";

function createData(
    phase: string,
    what: string,
    who: string,
    how: string,
): RowData {
    return {phase, what, who, how};
}

const rows = [
    createData('Ethos/Vision', 'לחוות תהליך תכן סדור לפיתוח מוצר, ללמוד על הכלים המובאים בקורס ולהתמקצע בתחום ההנדסי והטכנולוגי', 'ארבע חברי הצוות ', 'הצוות נפגש לסיעור מוחות בפגישה מתוזמנת דרך אפליקציית zoom, בה כל חבר צוות העלה את חזונו והשקפתו אודות הקורס ומטרותיו האישיות בו. בסופו של המפגש לאחר איחוד ושקלול רצונות חברי הצוות, מטרות הקבוצה הוגדרו כהלכה וכן אופן שיתוף הפעולה בין חברי הקבוצה.'),
    createData('Counseling/ Reflection', 'בדק בית וביקורת עצמית שאכן העבודה נעשית לפי שיטות וכלים נבחרים, כמו ביקורת עבור הניהול הטכני וניהול הזמן של הנושאים השונים בין חברי הקבוצה', 'ארבע חברי הצוות, המרצה (פרופסור יורם רייך), מידע אינטרנטי, חברים ומשפחה לייעוץ עבור שימוש במוצר, אנשי תעשייה לייעוץ הנדסי וטכנולוגי', 'הצוות נפגש בתדירות שבועית (בימי שישי) באפליקציית zoom כאשר קובעים מראש את מועד ושעת המפגש על ידי הודעות ב- Whatsapp. מפגש עם כל יועץ אחר גם דרך zoom בנוכחות כל הצוות כאשר קביעת המועד ייתבצע קודם לכך במייל. למידת הכלים השונים בעזרת תוכן הקורס ״תכן הנדסי״, ידע קיים וחיפוש יעיל באינטרנט.\n' +
        'בנוסף לאחר כל אבן דרך שהוגדרה מראש ע"י הצוות, נעשתה הפסקה ומעבר על התכן שהופק מאותה אבן הדרך על מנת לראות שהקורלציה בין הethos לdaily life עומדת בעינה.\n'),
    createData('Daily life', 'מוצר טכנולוגי או מוצר חכם אשר פותר צורך יומיומי ואקטואלי, ומיועד לשוק רחב ככל הניתן', 'ארבע חברי הצוות (בעלי ידע בתחומים השונים כדלהלן: ביצועים וטילאות, תוכנה בדגש על ארכיטקטורה, תכן מכאני, חישוב חוזק, רחפנים ואווירודינאמיקה, אלקטרוניקה)\n' +
        'אנשי בטיחות, רגולטורים ואנשי חוק עבור מוצרי טכנולוגיה (היי-טק)\n', 'שימוש ב-COTS (Costume made off the shelf)\n' +
        'שימוש בכלים מתוק ארסנל ה- QFD (Quality Function Deployment) כגון שימוש סכלים הבאים:\n' +
        'AHP , House of Quality\n' +
        'Affinity, Diagram , SWOT\n' +
        'טבלה מורפולוגית  Pugh,  DFV,\n' +
        'Word Excel, Matlab,   \n' +
        'עבודת מחקר וקריאה אינדווידואלית של כל חבר  צוות ממידע אנטרנטי \n' +
        'תובנות מושכלות מהרצאות הקורס לטובת המוצר\n' +
        'שיתוף והפריה הדדית בין חברי הצוות \n'),
];

export default function BasicTable() {
    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth: 650}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell align="right">Why / What</TableCell>
                        <TableCell align="right">Who</TableCell>
                        <TableCell align="right">How</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.phase}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                <bdi dir='auto'>{row.phase}</bdi>
                            </TableCell>
                            <TableCell align="right"><bdi dir='auto'>{row.what}</bdi></TableCell>
                            <TableCell align="right"><bdi dir='auto'>{row.who}</bdi></TableCell>
                            <TableCell align="right"><bdi dir='auto'>{row.how}</bdi></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
