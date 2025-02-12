export default function handler(req, res) {
    const { targetDateTime } = req.query; // 接受请求中的目标日期时间参数
    const targetDate = new Date(targetDateTime);

    if (isNaN(targetDate)) {
        res.status(400).json({ message: 'Invalid date format' });
        return;
    }

    scheduleSingleRun(targetDate, () => {
        console.log('Task is running at the scheduled time:', new Date().toLocaleString());
    });

    res.status(200).json({ message: 'Task scheduled successfully' });
}

function scheduleSingleRun(date, task) {
    const now = new Date();
    const timeUntilExecution = date.getTime() - now.getTime();

    if (timeUntilExecution > 0) {
        setTimeout(() => {
            task();
        }, timeUntilExecution);
    } else {
        console.log('The specified date is in the past.');
    }
}
