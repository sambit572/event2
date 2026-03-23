const sendDummyReminder = (agenda) => {
  agenda.define("send dummy reminder", async (job) => {
    const { email, name } = job.attrs.data;

    console.log("🔥 [Dummy Job] Running send dummy reminder");
    console.log(`📨 Sending fake reminder to: ${email}`);
    console.log(`👤 User name: ${name}`);
  });
};

export default sendDummyReminder;
