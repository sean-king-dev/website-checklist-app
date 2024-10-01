// src/Checklist.js
import React, { useState } from 'react';
import Papa from 'papaparse';

const Checklist = () => {
  const [url, setUrl] = useState('');
  const [checklist, setChecklist] = useState([
    { id: 1, task: 'Check all links', completed: false },
    { id: 2, task: 'Test forms', completed: false },
    { id: 3, task: 'Verify image loading', completed: false },
    { id: 4, task: 'Check responsiveness', completed: false },
    { id: 5, task: 'Test keyboard navigation', completed: false },
    // Add more tasks as needed
  ]);

  const handleCheckboxChange = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleSave = () => {
    if (!url) {
      alert("Please enter a URL before saving.");
      return;
    }

    // Create the CSV data
    const csv = Papa.unparse({
      fields: ['URL', 'Task', 'Completed'],
      data: checklist.map((item) => [url, item.task, item.completed]),
    });

    // Create a timestamp for the filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `checklist_${timestamp}_${encodeURIComponent(url)}.csv`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const csvUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = csvUrl;
    a.download = filename; // Use the dynamic filename here
    a.click();
    URL.revokeObjectURL(csvUrl);
  };

  const handleLoad = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const loadedChecklist = results.data.slice(1).map(([loadedUrl, task, completed]) => ({
            task,
            completed: completed === 'true',
          }));
          setChecklist(loadedChecklist);
          setUrl(results.data[0][0]); // Assuming the first row has the URL
        },
      });
    }
  };

  return (
    <div>
      <h1>QA Checklist</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL"
      />
      <ul>
        {checklist.map((item) => (
          <li key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleCheckboxChange(item.id)}
              />
              {item.task}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSave}>Save to CSV</button>
      <input type="file" onChange={handleLoad} accept=".csv" />
    </div>
  );
};

export default Checklist;
