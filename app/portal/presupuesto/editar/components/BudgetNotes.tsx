"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, User, Calendar, StickyNote } from "lucide-react";
import { toast } from "sonner";
import type { BudgetNote } from "@/types/presupuesto";

interface BudgetNotesProps {
  notes: BudgetNote[];
  onAddNote: (content: string) => Promise<void>;
  loading?: boolean;
}

export function BudgetNotes({ 
  notes, 
  onAddNote,
  loading = false 
}: BudgetNotesProps) {
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      toast.error("La nota no puede estar vacía");
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddNote(newNote.trim());
      setNewNote("");
      toast.success("Nota agregada correctamente");
    } catch (error) {
      toast.error("Error al agregar la nota");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-CL", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Card className="rounded-xl shadow-sm border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Notas Internas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#244F82] border-r-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-sm border-gray-200">
      <CardHeader className="border-b border-gray-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-amber-600" />
            Notas Internas
          </CardTitle>
          <span className="text-xs text-gray-500 font-medium">
            {notes.length} {notes.length === 1 ? "nota" : "notas"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Add new note */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agregar nueva nota
          </label>
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Escribe una nota interna sobre este presupuesto..."
            className="min-h-[100px] resize-none mb-3"
            disabled={isSubmitting}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleAddNote}
              disabled={isSubmitting || !newNote.trim()}
              className="gap-2 bg-[#244F82] hover:bg-[#1a3a5f]"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              {isSubmitting ? "Agregando..." : "Agregar nota"}
            </Button>
          </div>
        </div>

        {/* Notes list */}
        {notes.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <StickyNote className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No hay notas todavía</p>
            <p className="text-xs text-gray-400 mt-1">
              Las notas internas son visibles solo para tu equipo
            </p>
          </div>
        ) : (
          <div className="border-t border-gray-200 pt-4">
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-4 pr-4">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-amber-50 border border-amber-100 rounded-lg p-4 hover:border-amber-200 transition-colors"
                  >
                    {/* Note header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
                          <User className="h-4 w-4 text-amber-700" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {note.author}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {formatDate(note.createdAt)} a las {formatTime(note.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Note content */}
                    <div className="pl-10">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>

                    {/* Note footer (if updated) */}
                    {note.updatedAt && note.updatedAt !== note.createdAt && (
                      <div className="mt-3 pt-3 border-t border-amber-200 pl-10">
                        <p className="text-xs text-gray-500 italic">
                          Editado el {formatDate(note.updatedAt)} a las {formatTime(note.updatedAt)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
