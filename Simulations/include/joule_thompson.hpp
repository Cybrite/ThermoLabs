#ifndef JOULE_THOMSON_HPP
#define JOULE_THOMSON_HPP

class JouleThomsonSimulation {
private:
    double P1, P2;
    double T;
    double muJT;
    double timeStep, totalTime, currentTime;

    double noise(double sigma = 0.05);
    double compute_muJT(double T, double P);

public:
    JouleThomsonSimulation(double inletP, double outletP, double temp,
                    double dt, double t_total);

    void step();
    void run();
    void displayFinal() const;
};

#endif