type Row = Record<string, unknown>;
type Where = Record<string, unknown>;

const matches = (row: Row, where: Where) =>
  Object.entries(where).every(([key, value]) => row[key] === value);

// where 절을 실제로 평가하는 최소한의 인메모리 모델.
// 호출 인자를 검사하는 대신 "누구의 행이 실제로 바뀌는가"를 검증하기 위해 사용한다.
export function createTable(rows: Row[]) {
  return {
    rows,
    // Prisma의 update/delete는 대상이 없으면 예외를 던진다
    async update({ where, data }: { where: Where; data: Row }) {
      const row = rows.find((candidate) => matches(candidate, where));
      if (!row) throw new Error("Record to update not found.");
      return Object.assign(row, data);
    },
    async delete({ where }: { where: Where }) {
      const index = rows.findIndex((candidate) => matches(candidate, where));
      if (index === -1) throw new Error("Record to delete does not exist.");
      return rows.splice(index, 1)[0];
    },
    async updateMany({ where, data }: { where: Where; data: Row }) {
      const targets = rows.filter((row) => matches(row, where));
      targets.forEach((row) => Object.assign(row, data));
      return { count: targets.length };
    },
    async deleteMany({ where }: { where: Where }) {
      const kept = rows.filter((row) => !matches(row, where));
      const count = rows.length - kept.length;
      rows.splice(0, rows.length, ...kept);
      return { count };
    },
    async findFirst({ where }: { where: Where }) {
      return rows.find((row) => matches(row, where)) ?? null;
    },
    async findUnique({ where }: { where: Where }) {
      return rows.find((row) => matches(row, where)) ?? null;
    },
  };
}
