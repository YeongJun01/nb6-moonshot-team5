import prisma from '../lib/prisma';

class TagRepository {
  findManyByNames(names: string[]) {
    return prisma.tag.findMany({
      where: {
        name: { in: names },
      },
    });
  }

  createManyByNames(names: string[]) {
    return prisma.$transaction(
      names.map((name) =>
        prisma.tag.create({
          data: { name },
        }),
      ),
    );
  }
}

export default new TagRepository();
