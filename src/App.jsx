import { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate, useParams} from "react-router-dom";
import { getTickets, createTicket, getTicketById, updateTicket} from "./services/ticketService";
import "./App.css";

function Header() {
  return(
    <header className="mb-10">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500 mb-2">
            Support overview
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Monitor and manage your support tickets.
          </p>
        </div>

        <NavLink
          to="/tickets/new"
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          + Create Ticket
        </NavLink>

      </div>

    </header>
  );
}

function TicketCard({
  title,
  description,
  customer,
  priority,
  status,
  category,
  onViewDetails
}) 
{
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between gap-4">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {category}
          </p>

          <h3 className="mt-2 text-lg font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
            priority === "low"
              ? "bg-slate-100 text-slate-600"
              : priority === "medium"
              ? "bg-yellow-100 text-yellow-700"
              : priority === "high"
              ? "bg-orange-100 text-orange-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {priority}
        </span>

      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

        <p className="text-sm text-slate-500">
          Customer:{" "}
          <span className="font-medium text-slate-700">
            {customer}
          </span>
        </p>

        <div className="flex items-center gap-3">

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
              status === "open"
                ? "bg-blue-100 text-blue-700"
                : status === "in-progress"
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {status}
          </span>

          <button
            onClick={() => onViewDetails()}
            className="text-sm font-semibold text-slate-900 hover:text-slate-600"
          >
            View details →
          </button>

        </div>

      </div>

    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 min-h-screen bg-slate-950 p-6 text-white">
        <h1 className="text-2xl font-bold tracking-tight">
          Resolvia
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Support Console
        </p>

        <nav className="mt-10 space-y-2">
          {/* yaha tera existing NavLink wala code */}
        </nav>
      </aside>

      <main className="min-w-0 flex-1 bg-slate-50 p-8">
        {children}
      </main>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-950 p-6 text-white sm:w-64">
      <h1 className="text-2xl font-bold tracking-tight">
        Resolvia
      </h1>

      <p className="mt-1 text-sm text-slate-400">
        Support Console
      </p>

      <nav className="mt-10 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block rounded-xl px-4 py-3 font-medium ${
              isActive
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/tickets"
          className={({ isActive }) =>
            `block rounded-xl px-4 py-3 font-medium ${
              isActive
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          Tickets
        </NavLink>

        <NavLink
          to="/tickets/new"
          className={({ isActive }) =>
            `block rounded-xl px-4 py-3 font-medium ${
              isActive
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`
          }
        >
          Create Ticket
        </NavLink>
      </nav>
    </aside>
  );
}

function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (error) {
        console.error("Failed to load dashboard tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const [selectedTicket, setSelectedTicket] = useState(null);

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "open"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "in-progress"
  ).length;

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "resolved"
  ).length;

  return(

    <div className="app flex min-h-screen">

      <Sidebar />

      <main className="main-content min-w-0 flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8">

        <Header />

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Total Tickets"
            value={totalTickets}
          />

          <StatCard
            label="Open"
            value={openTickets}
          />

          <StatCard
            label="In Progress"
            value={inProgressTickets}
          />

          <StatCard
            label="Resolved"
            value={resolvedTickets}
          />

        </div>

        <div className="mt-10 mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recent Tickets
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest support requests and their current status.
            </p>
          </div>

          <span className="text-sm font-medium text-slate-500">
            {tickets.length} tickets
          </span>
        </div>

        {loading && (
          <p className="text-sm text-slate-500">
            Loading tickets...
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.title}
              title={ticket.title}
              description={ticket.description}
              customer={ticket.customer}
              category={ticket.category}
              priority={ticket.priority}
              status={ticket.status}
              onViewDetails={() => setSelectedTicket(ticket)}
            />
          ))}

        </div>

        {selectedTicket && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Ticket Details
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {selectedTicket.title}
            </h2>

            <p className="mt-3 text-slate-500">
              {selectedTicket.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">

              <div>
                <p className="text-xs font-medium text-slate-400">Customer</p>
                <p className="mt-1 font-medium text-slate-800">
                  {selectedTicket.customer}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Category</p>
                <p className="mt-1 font-medium capitalize text-slate-800">
                  {selectedTicket.category}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Priority</p>
                <p className="mt-1 font-medium capitalize text-slate-800">
                  {selectedTicket.priority}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Status</p>
                <p className="mt-1 font-medium capitalize text-slate-800">
                  {selectedTicket.status}
                </p>
              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}

function Tickets() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (error) {
        setError("Unable to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="min-w-0 flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-500">
            Support management
          </p>

          <div className="mt-1 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Tickets
              </h1>

              <p className="mt-2 text-slate-500">
                View and manage all support requests.
              </p>
            </div>

            <NavLink
              to="/tickets/new"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              + Create Ticket
            </NavLink>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Ticket count */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            All Tickets
          </h2>

          <span className="text-sm text-slate-500">
            {filteredTickets.length} tickets
          </span>
        </div>

        {loading && (
          <p className="mb-4 text-sm text-slate-500">
            Loading tickets...
          </p>
        )}

        {error && (
          <p className="mb-4 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        {/* Tickets */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {ticket.category}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-slate-900">
                    {ticket.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {ticket.description}
                  </p>
                </div>

                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold capitalize text-red-700">
                  {ticket.priority}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <p className="text-sm text-slate-500">
                  Customer:{" "}
                  <span className="font-medium text-slate-700">
                    {ticket.customer}
                  </span>
                </p>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                    {ticket.status}
                  </span>

                  <NavLink
                    to={`/tickets/${ticket.id}`}
                    className="text-sm font-semibold text-slate-900 hover:text-slate-600"
                  >
                    View details →
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function CustomSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  return (
    <div className="relative w-40">

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all duration-200 ${
          open
            ? "rounded-b-lg bg-slate-800"
            : "hover:bg-slate-800"
        }`}
      >
        <span>{selectedOption?.label}</span>

        <span
          className={`text-xs transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">

          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              style={{
                animationDelay: `${index * 45}ms`,
              }}
              className={`dropdown-option block w-full rounded-lg px-3 py-2.5 text-left text-sm transition-all duration-150 ${
                value === option.value
                  ? "bg-slate-900 font-semibold text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {option.label}
            </button>
          ))}

        </div>
      )}
    </div>
  );
}

function TicketDetails() {
  const { id } = useParams();

  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const data = await getTicketById(id);

        setTicket(data);
        setStatus(data.status);
        setPriority(data.priority);
        setResolutionNotes(data.resolutionNotes || "");
      } catch (error) {
        setError("Unable to load ticket.");
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-slate-500">
        Loading ticket...
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="p-8 text-red-600">
        {error || "Ticket not found."}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="min-w-0 flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <NavLink
            to="/tickets"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Tickets
          </NavLink>

          <p className="mt-6 text-sm font-medium text-slate-500">
            Ticket #{ticket.id}
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {ticket.title}
          </h1>

          <p className="mt-2 text-slate-500">
            View and manage ticket details.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Description
              </p>

              <p className="mt-2 leading-7 text-slate-700">
                {ticket.description}
              </p>
            </div>

            <CustomSelect
              value={priority}
              onChange={setPriority}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
                { value: "critical", label: "Critical" },
              ]}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 border-t border-slate-100 pt-6 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-slate-400">
                Customer
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {ticket.customer}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Category
              </p>
              <p className="mt-1 font-medium capitalize text-slate-800">
                {ticket.category}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Status
              </p>

              <CustomSelect
                value={status}
                onChange={setStatus}
                options={[
                  { value: "open", label: "Open" },
                  { value: "in-progress", label: "In Progress" },
                  { value: "resolved", label: "Resolved" },
                ]}
              />
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Resolution Notes
              </label>

              <textarea
                rows="5"
                value={resolutionNotes}
                onChange={(event) => setResolutionNotes(event.target.value)}
                placeholder="Add notes about how this issue was resolved..."
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const updatedTicket = await updateTicket(ticket.id, {
                      status,
                      priority,
                      resolutionNotes,
                    });

                    setTicket(updatedTicket);

                    console.log("Ticket updated successfully:", updatedTicket);
                  } catch (error) {
                    console.error("Failed to update ticket:", error);
                  }
                }}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Update Ticket
              </button>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

function CreateTicket() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    customer: "",
    category: "other",
    priority: "low",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createTicket({
        ...formData,
        status: "open",
        resolutionNotes: "",
      });

      navigate("/tickets");
    } catch (error) {
      console.error("Failed to create ticket:", error);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="min-w-0 flex-1 bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mb-8">
          <NavLink
            to="/tickets"
            className="text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            ← Back to Tickets
          </NavLink>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            Create Ticket
          </h1>

          <p className="mt-2 text-slate-500">
            Create a new technical support request.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Ticket Title
              </label>

              <input
                type="text"
                value={formData.title}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    title: event.target.value,
                  })
                }
                placeholder="e.g. Printer not working"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Customer
              </label>

              <input
                type="text"
                value={formData.customer}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    customer: event.target.value,
                  })
                }
                placeholder="Customer name"
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Description
              </label>

              <textarea
                rows="5"
                value={formData.description}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    description: event.target.value,
                  })
                }
                placeholder="Describe the issue..."
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Category
                </label>

                <select
                  value={formData.category}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      category: event.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
                >
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="network">Network</option>
                  <option value="account">Account</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Priority
                </label>

                <select
                  value={formData.priority}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      priority: event.target.value,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-6">
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/tickets/new" element={<CreateTicket />} />
      <Route path="/tickets/:id" element={<TicketDetails />} />
    </Routes>
  );
}


export default App