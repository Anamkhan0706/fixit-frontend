export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} FixIt. Built as a Week 2 internship deliverable.</p>
        <p>Local home services, booked simply.</p>
      </div>
    </footer>
  );
}
