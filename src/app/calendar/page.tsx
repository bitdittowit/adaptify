import { CalendarComponent } from '@/components/Calendar/CalendarComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CalendarPage() {
    return (
        <div className="w-full max-w-5xl mx-auto px-2 py-4 md:py-6">
            <Card className="bg-card shadow-sm border">
                <CardHeader className="pb-0">
                    <CardTitle className="text-xl md:text-2xl text-center md:text-left">Календарь</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center max-h-[calc(100vh-10rem)] overflow-y-auto py-2">
                        <CalendarComponent />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
