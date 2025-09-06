import React, { useMemo, useState } from "react";
import HistoryFilters from "./HistoryFilters";
import HistoryList from "./HistoryList";
import HistoryDetails from "./HistoryDetails";

const CONTRACT_TYPES = ["CDD", "VIP", "PROMO", "FAMILIALE"]; // même que @Vente/

const PRODUCTS_BY_CONTRACT = {
  CDD: [
    { id: "cdd_mensuel", name: "Abonnement Mensuel", price: 300, duration: 1 },
    {
      id: "cdd_trimestriel",
      name: "Abonnement Trimestriel",
      price: 800,
      duration: 3,
    },
    {
      id: "cdd_semestriel",
      name: "Abonnement Semestriel",
      price: 1500,
      duration: 6,
    },
  ],
  VIP: [
    { id: "vip_mensuel", name: "VIP Mensuel", price: 500, duration: 1 },
    {
      id: "vip_trimestriel",
      name: "VIP Trimestriel",
      price: 1400,
      duration: 3,
    },
    { id: "vip_annuel", name: "VIP Annuel", price: 5000, duration: 12 },
  ],
  PROMO: [
    { id: "promo_essai", name: "Essai 15 jours", price: 150, duration: 0.5 },
    { id: "promo_mensuel", name: "Promo Mensuel", price: 200, duration: 1 },
    {
      id: "promo_trimestriel",
      name: "Promo Trimestriel",
      price: 500,
      duration: 3,
    },
  ],
  FAMILIALE: [
    { id: "familiale_2", name: "Pack 2 personnes", price: 450, duration: 1 },
    { id: "familiale_4", name: "Pack 4 personnes", price: 800, duration: 1 },
    { id: "familiale_6", name: "Pack 6 personnes", price: 1100, duration: 1 },
  ],
};

function generateMockData(activeClient) {
  const clientData = {
    id: activeClient?.id,
    prenom: activeClient?.prenom,
    nom: activeClient?.nom,
    Code_client: activeClient?.Code_client,
    CIN: activeClient?.CIN,
    Club: activeClient?.Club,
  };

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const sales = Array.from({ length: 12 }).map((_, idx) => {
    const type = pick(CONTRACT_TYPES);
    const product = pick(PRODUCTS_BY_CONTRACT[type]);
    const quantity = [1, 1, 2, 3][Math.floor(Math.random() * 4)];
    const discount = [0, 0, 10, 15][Math.floor(Math.random() * 4)];
    const unit = product.price;
    const total = unit * quantity * (1 - discount / 100);
    const date = new Date();
    date.setDate(date.getDate() - idx * 7);
    return {
      id: `S-${idx + 1}`,
      date: date.toISOString().split("T")[0],
      contractType: type,
      productId: product.id,
      productName: product.name,
      quantity,
      unitPrice: unit,
      discountPercent: discount,
      totalPrice: total,
      status: ["payee", "en_attente"][Math.floor(Math.random() * 2)],
      client: clientData,
    };
  });

  const payments = sales.slice(0, 10).map((sale, idx) => ({
    id: `P-${idx + 1}`,
    date: sale.date,
    method: ["Espèces", "Carte", "Virement"][Math.floor(Math.random() * 3)],
    amount: sale.totalPrice,
    status: ["valide", "en_attente"][Math.floor(Math.random() * 2)],
    reference: `REF-${1000 + idx}`,
    client: clientData,
    saleId: sale.id,
  }));

  return { sales, payments };
}

const HistoryManagementModal = ({ client, onClose }) => {
  const [activeTab, setActiveTab] = useState("sales"); // sales | payments
  const [currentView, setCurrentView] = useState("list"); // list | details
  const [selectedItem, setSelectedItem] = useState(null);

  const [filters, setFilters] = useState({
    contractType: "",
    productId: "",
    productQuery: "",
    dateFrom: "",
    dateTo: "",
  });

  const { sales, payments } = useMemo(
    () => generateMockData(client),
    [client?.id]
  );

  const productsForFilter = useMemo(() => {
    if (!filters.contractType) return [];
    return PRODUCTS_BY_CONTRACT[filters.contractType] || [];
  }, [filters.contractType]);

  const applyFilters = (items, isSale) => {
    return items.filter((item) => {
      // Date range
      const inDate = (() => {
        if (!filters.dateFrom && !filters.dateTo) return true;
        const ts = new Date(item.date).getTime();
        const from = filters.dateFrom
          ? new Date(filters.dateFrom).getTime()
          : -Infinity;
        const to = filters.dateTo
          ? new Date(filters.dateTo).getTime()
          : Infinity;
        return ts >= from && ts <= to;
      })();

      // For sales: contractType/product filters + product query
      const inProduct = (() => {
        if (!isSale) return true;
        if (filters.contractType && item.contractType !== filters.contractType)
          return false;
        if (filters.productId && item.productId !== filters.productId)
          return false;
        if (filters.productQuery) {
          const q = filters.productQuery.toLowerCase();
          if (!(item.productName || "").toLowerCase().includes(q)) return false;
        }
        return true;
      })();

      return inDate && inProduct;
    });
  };

  const filteredSales = useMemo(
    () => applyFilters(sales, true),
    [sales, filters]
  );
  const filteredPayments = useMemo(
    () => applyFilters(payments, false),
    [payments, filters]
  );

  const openDetails = (item) => {
    setSelectedItem(item);
    setCurrentView("details");
  };

  const backToList = () => {
    setSelectedItem(null);
    setCurrentView("list");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Historique</h2>
              <p className="text-gray-500 text-sm">
                {client?.prenom} {client?.nom}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => {
                setActiveTab("sales");
                setCurrentView("list");
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "sales"
                  ? "bg-white shadow text-indigo-700"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Ventes
            </button>
            <button
              onClick={() => {
                setActiveTab("payments");
                setCurrentView("list");
              }}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === "payments"
                  ? "bg-white shadow text-indigo-700"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Paiements
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6">
          <HistoryFilters
            filters={filters}
            onChange={setFilters}
            contractTypes={CONTRACT_TYPES}
            products={productsForFilter}
            showProductFilters={activeTab === "sales"}
            showClientFilter={false}
          />
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {currentView === "list" && (
            <HistoryList
              items={activeTab === "sales" ? filteredSales : filteredPayments}
              type={activeTab}
              onOpenDetails={openDetails}
            />
          )}

          {currentView === "details" && selectedItem && (
            <HistoryDetails
              item={selectedItem}
              type={activeTab}
              onBack={backToList}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryManagementModal;
