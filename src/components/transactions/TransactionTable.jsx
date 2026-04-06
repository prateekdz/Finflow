import { format } from "date-fns";
import { ArrowDownRight, ArrowUpRight, Trash2, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/uiStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatINR } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const TransactionTable = ({
  transactions,
  isLoading,
  onDelete,
  isDeletingId
}) => {
  const { role } = useUiStore();

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 mt-6"
      >
        <Skeleton className="h-12 w-full rounded-xl" />
        {[1,2,3,4,5].map(i => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Skeleton className="h-16 w-full rounded-xl" />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (!transactions.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-20 px-6 border border-dashed rounded-2xl bg-card/30 mt-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-6 shadow-sm"
        >
          <ArrowRightLeft className="h-8 w-8 text-primary/70" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg font-semibold text-foreground"
        >
          No transactions found
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground mt-2 max-w-sm text-center leading-relaxed"
        >
          {role === 'admin'
            ? "Add your first transaction using the button above to start tracking your financial journey."
            : "There are no transactions matching your current filters."}
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border/50 bg-card/50 overflow-hidden mt-6 shadow-sm hover:shadow-lg transition-all duration-500"
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-muted/20 border-border/30">
            <TableHead className="w-[110px] text-xs uppercase tracking-wider font-semibold text-muted-foreground/80 py-4">
              Date
            </TableHead>
            <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground/80 py-4">
              Description
            </TableHead>
            <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground/80 py-4">
              Category
            </TableHead>
            <TableHead className="text-xs uppercase tracking-wider font-semibold text-muted-foreground/80 py-4">
              Type
            </TableHead>
            <TableHead className="text-right text-xs uppercase tracking-wider font-semibold text-muted-foreground/80 py-4">
              Amount (₹)
            </TableHead>
            {role === "admin" && <TableHead className="w-[60px] py-4" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence>
            {transactions.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group cursor-default transition-all duration-300 hover:bg-muted/20 border-border/30 hover:border-border/50 hover:shadow-sm"
              >
                <TableCell className="text-muted-foreground/80 text-sm font-medium py-4">
                  {format(new Date(transaction.date), "dd MMM yy")}
                </TableCell>
                <TableCell className="font-medium text-sm text-foreground py-4 group-hover:text-foreground/90 transition-colors">
                  {transaction.description}
                </TableCell>
                <TableCell className="py-4">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-secondary/50 text-secondary-foreground capitalize border border-border/30 shadow-sm"
                  >
                    {transaction.category}
                  </motion.span>
                </TableCell>
                <TableCell className="py-4">
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border shadow-sm transition-all duration-300",
                      transaction.type === "income"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20 group-hover:bg-red-500/20"
                    )}
                  >
                    {transaction.type === "income" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {transaction.type === "income" ? "Credit" : "Debit"}
                  </motion.span>
                </TableCell>
                <TableCell className="text-right py-4">
                  <motion.span
                    className={cn(
                      "font-bold text-sm px-2 py-1 rounded-lg transition-all duration-300",
                      transaction.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                        : "text-foreground bg-muted/30"
                    )}
                    whileHover={{ scale: 1.05 }}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatINR(transaction.amount)}
                  </motion.span>
                </TableCell>
                {role === "admin" && (
                  <TableCell className="opacity-0 group-hover:opacity-100 transition-all duration-300 text-right py-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all duration-300"
                        onClick={() => onDelete(transaction.id)}
                        disabled={isDeletingId === transaction.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </TableCell>
                )}
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </motion.div>
  );
};
