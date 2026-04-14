import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/marquee";

const EXAMPLE_QUESTIONS_ROW1 = [
  "What's your biggest fear?",
  "What motivates you every day?",
  "What's a skill you wish you had?",
  "If you could travel anywhere, where would you go?",
  "What's the best advice you've ever received?",
  "What do you do to relax after a long day?",
  "What's your unpopular opinion?",
  "What's a book that changed your life?",
];

const EXAMPLE_QUESTIONS_ROW2 = [
  "What's your favorite hobby?",
  "If you could have dinner with anyone, who?",
  "What's one thing people don't know about you?",
  "What's your dream job?",
  "What makes you laugh the most?",
  "What are you grateful for today?",
  "What's the craziest thing you've ever done?",
  "What do you think about at 3 AM?",
];

function QuestionCard({ question }: { question: string }) {
  return (
    <Card className="w-[280px] shrink-0">
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          &ldquo;{question}&rdquo;
        </p>
      </CardContent>
    </Card>
  );
}

export function QuestionMarquee() {
  return (
    <section className="space-y-2 overflow-hidden">
      <Marquee speed={35} direction="right">
        {EXAMPLE_QUESTIONS_ROW1.map((q) => (
          <QuestionCard key={q} question={q} />
        ))}
      </Marquee>
      <Marquee speed={35} direction="left">
        {EXAMPLE_QUESTIONS_ROW2.map((q) => (
          <QuestionCard key={q} question={q} />
        ))}
      </Marquee>
    </section>
  );
}
