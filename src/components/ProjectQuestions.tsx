import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageCircleQuestion, Trash2, Edit3 } from 'lucide-react';
import { useProjectQuestions, useAskQuestion, useAnswerQuestion, useDeleteQuestion } from '@/hooks/useProjectQuestions';
import { formatDistanceToNow } from 'date-fns';

interface ProjectQuestionsProps {
  projectId: string;
  isOwner: boolean;
  hasApplied: boolean;
}

const ProjectQuestions: React.FC<ProjectQuestionsProps> = ({ projectId, isOwner, hasApplied }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);

  const { data: questions = [], isLoading } = useProjectQuestions(projectId);
  const askQuestionMutation = useAskQuestion();
  const answerQuestionMutation = useAnswerQuestion();
  const deleteQuestionMutation = useDeleteQuestion();

  const handleAskQuestion = async () => {
    if (!question.trim()) return;
    
    await askQuestionMutation.mutateAsync({ projectId, question });
    setQuestion('');
    setIsQuestionDialogOpen(false);
  };

  const handleAnswerQuestion = async (questionId: string) => {
    if (!answer.trim()) return;
    
    await answerQuestionMutation.mutateAsync({ questionId, answer, projectId });
    setAnswer('');
    setEditingQuestionId(null);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    await deleteQuestionMutation.mutateAsync({ questionId, projectId });
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading questions...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircleQuestion className="h-5 w-5" />
          Questions & Answers
        </h3>
        
        {hasApplied && !isOwner && (
          <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Ask a Question
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ask a Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="question">Your Question</Label>
                  <Textarea
                    id="question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question about this project..."
                    rows={4}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsQuestionDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAskQuestion}
                    disabled={!question.trim() || askQuestionMutation.isPending}
                  >
                    {askQuestionMutation.isPending ? 'Submitting...' : 'Submit Question'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            No questions yet. {hasApplied && !isOwner && "Be the first to ask!"}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <Card key={q.id} className="border-l-4 border-l-primary/20">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">{q.question}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Asked {formatDistanceToNow(new Date(q.created_at), { addSuffix: true })}
                    </p>
                  </div>
                  {isOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteQuestion(q.id)}
                      disabled={deleteQuestionMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {q.answer ? (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-primary">Project Owner:</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(q.answered_at!), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm">{q.answer}</p>
                  </div>
                ) : isOwner ? (
                  <div className="space-y-3">
                    {editingQuestionId === q.id ? (
                      <div className="space-y-3">
                        <Textarea
                          value={answer}
                          onChange={(e) => setAnswer(e.target.value)}
                          placeholder="Type your answer..."
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAnswerQuestion(q.id)}
                            disabled={!answer.trim() || answerQuestionMutation.isPending}
                          >
                            {answerQuestionMutation.isPending ? 'Submitting...' : 'Submit Answer'}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingQuestionId(null);
                              setAnswer('');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingQuestionId(q.id)}
                        className="flex items-center gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Answer Question
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Waiting for answer...</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectQuestions;