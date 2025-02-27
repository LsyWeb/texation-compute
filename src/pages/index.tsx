import { useState, ChangeEvent } from "react";

interface TaxBracket {
  min: number;
  rate: number;
  deduction: number;
}

interface CalculationResults {
  pension: number;
  medical: number;
  unemployment: number;
  housingFund: number;
  taxableIncome: number;
  tax: number;
  netIncome: number;
}

const handleInputChange =
  (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) =>
    setter(e.target.value);

const FormTextInput = ({
  label,
  placeholder,
  value,
  onChange,
}: {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <div className="mb-4 flex flex-col">
      <label className="text-gray-700">{label}</label>
      <input
        type="number"
        value={value}
        onChange={handleInputChange(onChange)}
        className="mt-1 block px-3 py-2 bg-white border border-style-solid border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
        placeholder={placeholder || "请输入"}
      />
    </div>
  );
};

const TaxCalculator = () => {
  const [income, setIncome] = useState<string>("");
  const [socialBase, setSocialBase] = useState<string>("");
  const [fundBase, setFundBase] = useState<string>("");
  const [fundRate, setFundRate] = useState<string>("12");
  const [results, setResults] = useState<CalculationResults>({
    pension: 0,
    medical: 0,
    unemployment: 0,
    housingFund: 0,
    taxableIncome: 0,
    tax: 0,
    netIncome: 0,
  });

  const taxBrackets: TaxBracket[] = [
    { min: 0, rate: 0.03, deduction: 0 },
    { min: 3000, rate: 0.1, deduction: 210 },
    { min: 12000, rate: 0.2, deduction: 1410 },
    { min: 25000, rate: 0.25, deduction: 2660 },
    { min: 35000, rate: 0.3, deduction: 4410 },
    { min: 55000, rate: 0.35, deduction: 7160 },
    { min: 80000, rate: 0.45, deduction: 15160 },
  ];

  const calculateTax = (taxableIncome: number): number => {
    if (taxableIncome <= 0) return 0;

    const bracket = [...taxBrackets]
      .reverse()
      .find((b) => taxableIncome >= b.min) as TaxBracket;

    return taxableIncome * bracket.rate - bracket.deduction;
  };

  const handleCalculate = () => {
    const numIncome = Number(income) || 0;
    const numSocialBase = Number(socialBase) || 0;
    const numFundBase = Number(fundBase) || 0;
    const numFundRate = Number(fundRate) || 0;

    // 计算五险一金
    const pension = numSocialBase * 0.08;
    const medical = numSocialBase * 0.02;
    const unemployment = numSocialBase * 0.005;
    const housingFund = numFundBase * (numFundRate / 100);
    const totalInsurance = pension + medical + unemployment + housingFund;

    // 计算应纳税所得额
    const taxableIncome = Math.max(numIncome - totalInsurance - 5000, 0);

    // 计算个人所得税
    const tax = Math.max(calculateTax(taxableIncome), 0);

    // 计算税后收入
    const netIncome = numIncome - totalInsurance - tax;

    setResults({
      pension,
      medical,
      unemployment,
      housingFund,
      taxableIncome,
      tax,
      netIncome,
    });
  };

  return (
    <div className="max-md-w-500px mx-auto my-20px p-20px font-sans bg-sky-1 rounded-8px">
      <h1 className="text-sky text-center text-24px mb-6">个税计算器</h1>
      {/* 输入区域 */}
      <div className="md-flex gap-4 justify-between ">
        <div className="md-flex-1 bg-white p-16px rounded-8px ">
          <FormTextInput
            label="税前月收入（元）"
            placeholder="请输入税前月收入"
            value={income}
            onChange={setIncome}
          />
          <FormTextInput
            label="社保基数（元）"
            placeholder="请输入社保基数"
            value={socialBase}
            onChange={setSocialBase}
          />
          <FormTextInput
            label="公积金基数（元）"
            placeholder="请输入公积金基数"
            value={fundBase}
            onChange={setFundBase}
          />
          <FormTextInput
            label="公积金缴存比例（%）"
            placeholder="请输入公积金缴存比例（%）"
            value={fundRate}
            onChange={setFundRate}
          />
        </div>

        <button
          onClick={handleCalculate}
          className=" md-hidden w-full my-4 py-3 bg-sky border-none text-white rounded-4px hover:bg-sky-500/75 active:bg-sky-600 transition-colors"
        >
          计算
        </button>

        {/* 计算结果 */}
        <div className="md-flex-1  bg-white p-20px rounded-8px">
          <h2 className="text-20px mb-4">计算结果</h2>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>养老保险 (8%)：</span>
            <span className="font-mono">{results.pension.toFixed(2)}元</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>医疗保险（2%）：</span>
            <span className="font-mono">{results.medical.toFixed(2)}元</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>失业保险（0.5%）：</span>
            <span className="font-mono">
              {results.unemployment.toFixed(2)}元
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>公积金：</span>
            <span className="font-mono">
              {results.housingFund.toFixed(2)}元
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>应纳税所得额：</span>
            <span className="font-mono">
              {results.taxableIncome.toFixed(2)}元
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span>个人所得税：</span>
            <span className="font-mono">{results.tax.toFixed(2)}元</span>
          </div>
          <div className="flex justify-between py-2">
            <span>税后实际收入：</span>
            <span className="font-mono text-sky">
              {results.netIncome.toFixed(2)}元
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="hidden md-block w-full my-4 py-3 bg-sky border-none text-white rounded-4px hover:bg-sky-500/75 active:bg-sky-600 transition-colors"
      >
        计算
      </button>

      {/* 计算说明 */}
      <div className="bg-white p-20px rounded-8px mt-4 md-mt-none">
        <h3 className="text-18px mb-3">个人所得税计算说明</h3>
        <p className="text-gray-600 mb-2">1. 五险一金计算规则：</p>
        <ul className="list-disc pl-6 mb-4 text-gray-600">
          <li className="mb-1">养老保险：缴费基数 × 8%</li>
          <li className="mb-1">医疗保险：缴费基数 × 2%</li>
          <li className="mb-1">失业保险：缴费基数 × 0.5%</li>
          <li>公积金：缴费基数 × 缴存比例</li>
        </ul>
        <p className="text-gray-600 mb-2">2. 个人所得税计算步骤：</p>
        <ul className="list-decimal pl-6 text-gray-600">
          <li className="mb-1">
            应纳税所得额 = 税前收入 - 五险一金 - 起征点（5000元）
          </li>
          <li className="mb-1">适用税率和速算扣除数根据应纳税所得额确定</li>
          <li>应纳税额 = 应纳税所得额 × 适用税率 - 速算扣除数</li>
        </ul>
      </div>
    </div>
  );
};

export default TaxCalculator;
