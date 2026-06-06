import { useTranslation } from "react-i18next";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  water: number;

  fertilizer: number;

  labour: number;

  equipment: number;
}

const COLORS = [
  "#3B82F6",
  "#22C55E",
  "#FACC15",
  "#6B7280",
];

const FieldAnalytics = ({
  water,
  fertilizer,
  labour,
  equipment,
}: Props) => {
  const { t } = useTranslation();

  const data = [
    {
      name: t("water"),
      value: water,
    },
    {
      name: t("fertilizer"),
      value: fertilizer,
    },
    {
      name: t("labour"),
      value: labour,
    },
    {
      name: t("equipment"),
      value: equipment,
    },
  ];

  return (
    <div
      className="
        bg-white
        rounded-3xl
        shadow-lg
        p-8
        mt-8
      "
    >

      {/* HEADER */}

      <div className="mb-8">

        <h2
          className="
            text-3xl
            font-bold
            bg-linear-to-r
            from-green-500
            to-green-800
            bg-clip-text
            text-transparent
          "
        >{t("expenseAnalytics")}</h2>

        <p className="text-gray-500 mt-2">{t("expenseDistribution")}</p>

      </div>

      {/* CHART */}

      <div className="h-[400px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={140}
              dataKey="value"
              label
            >

              {data.map(
                (_, index) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[index]
                    }
                  />
                )
              )}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      {/* SUMMARY */}

      <div
        className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-4
          mt-8
        "
      >

        {/* WATER */}

        <div
          className="
            rounded-2xl
            bg-blue-50
            p-5
          "
        >

          <p className="text-gray-500">{t("water")}</p>

          <h3 className="text-2xl font-bold text-blue-700 mt-2">
            {water}
          </h3>

        </div>

        {/* FERTILIZER */}

        <div
          className="
            rounded-2xl
            bg-green-50
            p-5
          "
        >

          <p className="text-gray-500">{t("fertilizer")}</p>

          <h3 className="text-2xl font-bold text-green-700 mt-2">
            â‚¹{fertilizer}
          </h3>

        </div>

        {/* LABOUR */}

        <div
          className="
            rounded-2xl
            bg-yellow-50
            p-5
          "
        >

          <p className="text-gray-500">{t("labour")}</p>

          <h3 className="text-2xl font-bold text-yellow-700 mt-2">
            â‚¹{labour}
          </h3>

        </div>

        {/* EQUIPMENT */}

        <div
          className="
            rounded-2xl
            bg-gray-100
            p-5
          "
        >

          <p className="text-gray-500">{t("equipment")}</p>

          <h3 className="text-2xl font-bold text-gray-700 mt-2">
            â‚¹{equipment}
          </h3>

        </div>

      </div>

    </div>
  );
};

export default FieldAnalytics;
