import type { PrismaClient } from "../../../src/generated/prisma/client.js";

type CategorySeed = {
  name: string;
  slug: string;
  description?: string;
  children?: CategorySeed[];
};

const categories: CategorySeed[] = [
  {
    name: "Alimentação",
    slug: "alimentacao",
    description: "Empresas e profissionais relacionados à alimentação.",
    children: [
      {
        name: "Restaurantes",
        slug: "restaurantes",
        description: "Restaurantes e estabelecimentos de refeições.",
      },
      {
        name: "Lanchonetes",
        slug: "lanchonetes",
        description: "Lanchonetes e estabelecimentos de lanches rápidos.",
      },
      {
        name: "Padarias",
        slug: "padarias",
        description: "Padarias e estabelecimentos de panificação.",
      },
      {
        name: "Docerias",
        slug: "docerias",
        description:
          "Docerias, confeitarias e estabelecimentos especializados em doces.",
      },
    ],
  },

  {
    name: "Beleza e Cuidados Pessoais",
    slug: "beleza-e-cuidados-pessoais",
    description: "Serviços relacionados à beleza e cuidados pessoais.",
    children: [
      {
        name: "Cabeleireiros",
        slug: "cabeleireiros",
        description:
          "Profissionais e estabelecimentos de serviços para cabelos.",
      },
      {
        name: "Barbearias",
        slug: "barbearias",
        description:
          "Barbearias e serviços especializados em cuidados masculinos.",
      },
      {
        name: "Manicure e Pedicure",
        slug: "manicure-e-pedicure",
        description: "Serviços de cuidados com unhas.",
      },
      {
        name: "Estética",
        slug: "estetica",
        description: "Serviços de estética e cuidados corporais.",
      },
    ],
  },

  {
    name: "Casa e Construção",
    slug: "casa-e-construcao",
    description:
      "Produtos e serviços relacionados a imóveis, construção e manutenção.",
    children: [
      {
        name: "Materiais de Construção",
        slug: "materiais-de-construcao",
        description: "Comércio de materiais para construção e reforma.",
      },
      {
        name: "Eletricistas",
        slug: "eletricistas",
        description: "Profissionais de serviços elétricos.",
      },
      {
        name: "Encanadores",
        slug: "encanadores",
        description: "Profissionais de serviços hidráulicos.",
      },
      {
        name: "Pintores",
        slug: "pintores",
        description: "Profissionais especializados em pintura.",
      },
    ],
  },

  {
    name: "Automotivo",
    slug: "automotivo",
    description: "Produtos e serviços relacionados a veículos.",
    children: [
      {
        name: "Oficinas Mecânicas",
        slug: "oficinas-mecanicas",
        description: "Serviços de manutenção e reparação automotiva.",
      },
      {
        name: "Autoelétrica",
        slug: "autoeletrica",
        description: "Serviços elétricos para veículos.",
      },
      {
        name: "Lava-Rápidos",
        slug: "lava-rapidos",
        description: "Serviços de limpeza e higienização de veículos.",
      },
      {
        name: "Pneus e Rodas",
        slug: "pneus-e-rodas",
        description: "Comércio e serviços relacionados a pneus e rodas.",
      },
    ],
  },

  {
    name: "Saúde",
    slug: "saude",
    description: "Profissionais e estabelecimentos relacionados à saúde.",
    children: [
      {
        name: "Clínicas",
        slug: "clinicas",
        description: "Clínicas e estabelecimentos de atendimento à saúde.",
      },
      {
        name: "Dentistas",
        slug: "dentistas",
        description: "Profissionais e consultórios odontológicos.",
      },
      {
        name: "Farmácias",
        slug: "farmacias",
        description: "Farmácias e estabelecimentos de produtos farmacêuticos.",
      },
    ],
  },

  {
    name: "Serviços Profissionais",
    slug: "servicos-profissionais",
    description:
      "Profissionais independentes e empresas prestadoras de serviços.",
    children: [
      {
        name: "Contabilidade",
        slug: "contabilidade",
        description: "Serviços contábeis e profissionais da área.",
      },
      {
        name: "Advocacia",
        slug: "advocacia",
        description: "Serviços jurídicos e profissionais da área.",
      },
      {
        name: "Fotografia",
        slug: "fotografia",
        description: "Fotógrafos e serviços de fotografia.",
      },
      {
        name: "Tecnologia",
        slug: "tecnologia",
        description: "Profissionais e empresas de tecnologia.",
      },
    ],
  },

  {
    name: "Comércio",
    slug: "comercio",
    description: "Estabelecimentos comerciais e lojas.",
    children: [
      {
        name: "Roupas e Moda",
        slug: "roupas-e-moda",
        description: "Lojas e profissionais relacionados a roupas e moda.",
      },
      {
        name: "Calçados",
        slug: "calcados",
        description: "Comércio de calçados e produtos relacionados.",
      },
      {
        name: "Mercados",
        slug: "mercados",
        description: "Mercados, mercearias e estabelecimentos similares.",
      },
      {
        name: "Lojas de Variedades",
        slug: "lojas-de-variedades",
        description: "Comércios com variedade de produtos.",
      },
    ],
  },

  {
    name: "Educação",
    slug: "educacao",
    description: "Instituições e profissionais relacionados à educação.",
    children: [
      {
        name: "Escolas",
        slug: "escolas",
        description: "Instituições de ensino.",
      },
      {
        name: "Cursos",
        slug: "cursos",
        description: "Cursos livres e profissionais.",
      },
      {
        name: "Aulas Particulares",
        slug: "aulas-particulares",
        description: "Profissionais que oferecem aulas particulares.",
      },
    ],
  },

  {
    name: "Lazer e Entretenimento",
    slug: "lazer-e-entretenimento",
    description: "Negócios e serviços relacionados a lazer e entretenimento.",
    children: [
      {
        name: "Eventos",
        slug: "eventos",
        description: "Serviços e empresas relacionados a eventos.",
      },
      {
        name: "Turismo",
        slug: "turismo",
        description: "Serviços turísticos e experiências locais.",
      },
      {
        name: "Esportes",
        slug: "esportes",
        description: "Atividades, serviços e estabelecimentos esportivos.",
      },
    ],
  },
];

export async function seedCategories(prisma: PrismaClient): Promise<void> {
  console.log("📚 Seeding categories...");

  for (const category of categories) {
    const parent = await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description ?? null,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description ?? null,
      },
    });

    console.log(`  ✓ ${parent.name}`);

    for (const child of category.children ?? []) {
      const savedChild = await prisma.category.upsert({
        where: {
          slug: child.slug,
        },
        update: {
          name: child.name,
          description: child.description ?? null,
          parentId: parent.id,
        },
        create: {
          name: child.name,
          slug: child.slug,
          description: child.description ?? null,
          parentId: parent.id,
        },
      });

      console.log(`    ✓ ${savedChild.name}`);
    }
  }
}
