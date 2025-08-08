document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("triviaForm");
  const output = document.getElementById("output");

  // Navbar stat elements
  const completionTimeEl = document.getElementById("completionTime");
  const promptTokensEl = document.getElementById("promptTokens");
  const totalTokensEl = document.getElementById("totalTokens");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const difficulty = document.getElementById("difficulty").value;
    const type = document.getElementById("type").value;
    const select = document.getElementById("category");
    const selectedText = select.options[select.selectedIndex].text;

    const prompt = `Generate ${amount} exam questions for the category "${selectedText}", difficulty "${difficulty}", and type "${type}". Format them clearly and please do not include correct answers.`;

    // Call your secure backend
    fetch("https://my-backend-service.onrender.com/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response from backend:", data);

        // Update navbar info
        promptTokensEl.textContent = data.usage?.prompt_tokens || "-";
        totalTokensEl.textContent = data.usage?.total_tokens || "-";
        completionTimeEl.textContent =
          (data.duration || "n/a") + " s";

        // Extract AI's response
        const aiResponse =
          data.choices?.[0]?.message?.content ||
          "No response received from AI.";

        // Generate PDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(`${selectedText} Exam Paper`, 105, 20, null, null, "center");

        doc.setFontSize(12);
        const lines = doc.splitTextToSize(aiResponse, 180);
        doc.text(lines, 10, 40);

        doc.save(`${selectedText}_exam_paper.pdf`);

        output.style.display = "block";
        output.innerText = "✅ PDF generated!";
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        output.style.display = "block";
        output.innerText = "❌ Error: Unable to fetch from backend.";
      });
  });
});
