/**
 * TransactionsController
 *
 * @description :: Server-side logic for managing Transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
    create: function(req,res)
    {
        var id, date, usd_amount, numOfCOT, amount, currency, key_or_account, user_private_sale, initials, user_transaction, input_amunt;
        
        id = req.session.User.id;
        date = new Date();
        numOfCOT = req.param('numOfCOT');
        usd_amount = Math.round((numOfCOT * 0.5) * 10000000) / 10000000;
        amount = req.param('amount_total');
        currency = req.param('currency');
        key_or_account = req.param('key_or_account');

        switch (currency) 
        {
            case '1':
                user_private_sale = { btc_key: key_or_account, user_id: id };
                initials = 'BTC';
                break;
            case '2':
                user_private_sale = { eth_key: key_or_account, user_id: id };
                initials = 'ETH';
                break;
            case '3':
                user_private_sale = { dash_key: key_or_account, user_id: id };
                initials = 'DASH';
                break;
            case '4':
                user_private_sale = { stellar_key: key_or_account, user_id: id };
                initials = 'XML';
                break;
        }

        input_amunt = amount + ' ' + initials;

        Transactions.create({ type: 1, amount: amount, currency: currency, date: date, numOfCOT: numOfCOT, account: key_or_account, usdAmount: usd_amount, status: 1, owner: id }).exec(function (err, transaction)
        {
            if (err)
            {
                if (req.session.language == 'spanish')
                    req.addFlash('error', 'Ha ocurrido un error creando la transacción, por favor confirme nuevamente.');
                else
                    req.addFlash('error', 'An error has occurred creating the transaction, please confirm again.');
                res.redirect('/dashboard');
            }
            else
            {
                if (req.session.User.private_sale) 
                {
                    user_investor__user_user_investor.findOne({ user_investor: id }).exec(function (err, investor)
                    {
                        if (err)
                        {
                            if (req.session.language == 'spanish')
                                req.addFlash('error', 'Ha ocurrido un error creando la transacción, por favor confirme nuevamente.');
                            else
                                req.addFlash('error', 'An error has occurred creating the transaction, please confirm again.');
                            res.redirect('/dashboard');
                        }
                        else if (!investor)
                        {
                            PrivateSale_profile.findOne({ user_id: id }).exec(function (err, private_profile)
                            {
                                if (err)
                                {
                                    if (req.session.language == 'spanish')
                                        req.addFlash('error', 'Ha ocurrido un error creando la transacción, por favor confirme nuevamente.');
                                    else
                                        req.addFlash('error', 'An error has occurred creating the transaction, please confirm again.');
                                    res.redirect('/dashboard');
                                }
                                else if (private_profile)
                                {
                                    PrivateSale_profile.update({ user_id: id }, user_private_sale ).exec(function (err, profile)
                                    {
                                        if (err)
                                        {
                                            if (req.session.language == 'spanish')
                                                req.addFlash('error', 'Ha ocurrido un error editando su clave pública o número de cuenta.');
                                            else
                                                req.addFlash('error', 'An error occurred editing your public key or account number.');
                                            res.redirect('/dashboard');
                                        }
                                        else
                                        {
                                            user_transaction = { email: req.session.User.email, name:  req.session.User.name, num_of_cot: numOfCOT, input: input_amunt };
                                            mailer.sendBuyEmail(user_transaction, req.session.language, function(err, message_mail)
                                            {
                                                if (req.session.language == 'spanish')
                                                    req.addFlash('info', 'Confirmación de transacción realizada exitosamente.');
                                                else
                                                    req.addFlash('info', 'Successful transaction confirmation.');
                                                res.redirect('/dashboard');
                                            });
                                        }
                                    });
                                }
                                else
                                {
                                    PrivateSale_profile.create(user_private_sale).exec(function (err, transaction)
                                    {
                                        if (err)
                                        {
                                            if (req.session.language == 'spanish')
                                                req.addFlash('error', 'Ha ocurrido un error editando su clave pública o número de cuenta.');
                                            else
                                                req.addFlash('error', 'An error occurred editing your public key or account number.');
                                            res.redirect('/dashboard');
                                        }
                                        else
                                        {
                                            user_transaction = { email: req.session.User.email, name:  req.session.User.name, num_of_cot: numOfCOT, input: input_amunt };
                                            mailer.sendBuyEmail(user_transaction, req.session.language, function(err, message_mail)
                                            {
                                                if (req.session.language == 'spanish')
                                                    req.addFlash('info', 'Confirmación de transacción realizada exitosamente.');
                                                else
                                                    req.addFlash('info', 'Successful transaction confirmation.');
                                                res.redirect('/dashboard');
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else
                        {
                            Transactions.create({ type: 2, amount: Math.round((amount * 0.1) * 10000000) / 10000000 , currency: currency, date: date, numOfCOT: Math.round((numOfCOT * 0.1) * 10000000) / 10000000, account: key_or_account, usdAmount: Math.round((usd_amount * 0.1) * 10000000) / 10000000, status: 1, owner: investor.user_user_investor, id_vinculate: transaction.id }).exec(function (err, transaction)
                            {
                                if (err)
                                {
                                    if (req.session.language == 'spanish')
                                        req.addFlash('error', 'Ha ocurrido un error creando la transacción, por favor confirme nuevamente.');
                                    else
                                        req.addFlash('error', 'An error has occurred creating the transaction, please confirm again.');
                                    res.redirect('/dashboard');
                                }
                                else
                                {
                                    PrivateSale_profile.findOne({ user_id: id }).exec(function (err, private_profile)
                                    {
                                        if (err)
                                        {
                                            if (req.session.language == 'spanish')
                                                req.addFlash('error', 'Ha ocurrido un error creando la transacción, por favor confirme nuevamente.');
                                            else
                                                req.addFlash('error', 'An error has occurred creating the transaction, please confirm again.');
                                            res.redirect('/dashboard');
                                        }
                                        else if (private_profile)
                                        {
                                            PrivateSale_profile.update({ user_id: id }, user_private_sale ).exec(function (err, profile)
                                            {
                                                if (err)
                                                {
                                                    if (req.session.language == 'spanish')
                                                        req.addFlash('error', 'Ha ocurrido un error editando su clave pública o número de cuenta.');
                                                    else
                                                        req.addFlash('error', 'An error occurred editing your public key or account number.');
                                                    res.redirect('/dashboard');
                                                }
                                                else
                                                {
                                                    user_transaction = { email: req.session.User.email, name:  req.session.User.name, num_of_cot: numOfCOT, input: input_amunt };
                                                    mailer.sendBuyEmail(user_transaction, req.session.language, function(err, message_mail)
                                                    {
                                                        if (req.session.language == 'spanish')
                                                            req.addFlash('info', 'Confirmación de transacción realizada exitosamente.');
                                                        else
                                                            req.addFlash('info', 'Successful transaction confirmation.');
                                                        res.redirect('/dashboard');
                                                    });
                                                }
                                            });
                                        }
                                        else
                                        {
                                            PrivateSale_profile.create(user_private_sale).exec(function (err, transaction)
                                            {
                                                if (err)
                                                {
                                                    if (req.session.language == 'spanish')
                                                        req.addFlash('error', 'Ha ocurrido un error editando su clave pública o número de cuenta.');
                                                    else
                                                        req.addFlash('error', 'An error occurred editing your public key or account number.');
                                                    res.redirect('/dashboard');
                                                }
                                                else
                                                {
                                                    user_transaction = { email: req.session.User.email, name:  req.session.User.name, num_of_cot: numOfCOT, input: input_amunt };
                                                    mailer.sendBuyEmail(user_transaction, req.session.language, function(err, message_mail)
                                                    {
                                                        if (req.session.language == 'spanish')
                                                            req.addFlash('info', 'Confirmación de transacción realizada exitosamente.');
                                                        else
                                                            req.addFlash('info', 'Successful transaction confirmation.');
                                                        res.redirect('/dashboard');
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
                else
                {
                    PrivateSale_profile.findOne({ user_id: id }).exec(function (err, private_profile)
                    {
                        if (err)
                        {
                            if (req.session.language == 'spanish')
                                req.addFlash('error', 'Ha ocurrido un error creando la transacción, por favor confirme nuevamente.');
                            else
                                req.addFlash('error', 'An error has occurred creating the transaction, please confirm again.');
                            res.redirect('/dashboard');
                        }
                        else if (private_profile)
                        {
                            PrivateSale_profile.update({ user_id: id }, user_private_sale ).exec(function (err, profile)
                            {
                                if (err)
                                {
                                    if (req.session.language == 'spanish')
                                        req.addFlash('error', 'Ha ocurrido un error editando su clave pública o número de cuenta.');
                                    else
                                        req.addFlash('error', 'An error occurred editing your public key or account number.');
                                    res.redirect('/dashboard');
                                }
                                else
                                {
                                    user_transaction = { email: req.session.User.email, name:  req.session.User.name, num_of_cot: numOfCOT, input: input_amunt };
                                    mailer.sendBuyEmail(user_transaction, req.session.language, function(err, message_mail)
                                    {
                                        if (req.session.language == 'spanish')
                                            req.addFlash('info', 'Confirmación de transacción realizada exitosamente.');
                                        else
                                            req.addFlash('info', 'Successful transaction confirmation.');
                                        res.redirect('/dashboard');
                                    });
                                }
                            });
                        }
                        else
                        {
                            PrivateSale_profile.create(user_private_sale).exec(function (err, transaction)
                            {
                                if (err)
                                {
                                    if (req.session.language == 'spanish')
                                        req.addFlash('error', 'Ha ocurrido un error editando su clave pública o número de cuenta.');
                                    else
                                        req.addFlash('error', 'An error occurred editing your public key or account number.');
                                    res.redirect('/dashboard');
                                }
                                else
                                {
                                    user_transaction = { email: req.session.User.email, name:  req.session.User.name, num_of_cot: numOfCOT, input: input_amunt };
                                    mailer.sendBuyEmail(user_transaction, req.session.language, function(err, message_mail)
                                    {
                                        if (req.session.language == 'spanish')
                                            req.addFlash('info', 'Confirmación de transacción realizada exitosamente.');
                                        else
                                            req.addFlash('info', 'Successful transaction confirmation.');
                                        res.redirect('/dashboard');
                                    });
                                }
                            });
                        }
                    });
                }
            }
        });
    },

    update: function(req,res)
    {
        var id, status, amount, new_max_number, amount_investor, user_transaction;
        
        id = req.param('id');
        status = req.param('status');
        
        Transactions.findOne({ id: id }).exec(function (err, transaction)
        {
            if (err)
            {
                req.addFlash('error', 'Ha ocurrido un error editando el estado de la transacción, por favor intente de nuevo.');
                res.redirect('/admin');
            }
            else
            {
                if (transaction.status != status) 
                {
                    User.findOne({ id: transaction.owner }).exec(function (err, user)
                    {
                        if (err)
                        {
                            req.addFlash('error', 'Ha ocurrido un error editando el estado de la transacción, por favor intente de nuevo.');
                            res.redirect('/admin');
                        }
                        else
                        {
                            if (user.private_sale) 
                            {
                                Transactions.findOne({ id_vinculate: id }).exec(function (err, transaction_vinculate)
                                {
                                    if (err)
                                    {
                                        req.addFlash('error', 'Ha ocurrido un error editando el estado de la transacción, por favor intente de nuevo.');
                                        res.redirect('/admin');
                                    }
                                    else if (!transaction_vinculate)
                                    {
                                        Transactions.update({ id: id }, { status: status }).exec(function (err, transaction_up)
                                        {
                                            if (err)
                                            {
                                                req.addFlash('error', 'Ha ocurrido un error editando el estado de la transacción, por favor intente de nuevo.');
                                                res.redirect('/admin');
                                            }
                                            else
                                            {
                                                Max_num_of_cot.findOne({ id: 1 }).exec(function (err, num_Of_COT)
                                                {
                                                    if (err)
                                                    {
                                                        if (req.session.language == 'spanish')
                                                            req.addFlash('error', 'Ha ocurrido un error, por favor intente de nuevo.');
                                                        else
                                                            req.addFlash('error', 'An error has occurred, please try again.');
                                                        res.redirect('/ico');
                                                    }
                                                    else
                                                    {
                                                        if (transaction_up[0].status == 2)
                                                        {
                                                            new_max_number = (Math.round(parseFloat(num_Of_COT.max_number) * 10000000) - Math.round(parseFloat(transaction.numOfCOT)* 10000000)) / 10000000;
                                                            amount = (Math.round(parseFloat(user.number_of_COT) * 10000000) + Math.round(parseFloat(transaction.numOfCOT)* 10000000)) / 10000000;
                                                        }
                                                        else
                                                        {
                                                            new_max_number = (Math.round(parseFloat(num_Of_COT.max_number) * 10000000) + Math.round(parseFloat(transaction.numOfCOT)* 10000000)) / 10000000;
                                                            amount = (Math.round(parseFloat(user.number_of_COT) * 10000000) - Math.round(parseFloat(transaction.numOfCOT)* 10000000)) / 10000000;
                                                        }

                                                        User.update({ id: transaction.owner }, { number_of_COT: amount }).exec(function (err, user_up)
                                                        {
                                                            if (err)
                                                            {
                                                                req.addFlash('error', 'Ha ocurrido un error editando el monto del usuario, por favor intente de nuevo.');
                                                                res.redirect('/admin');
                                                            }
                                                            else
                                                            {
                                                                Max_num_of_cot.update({ id: 1 }, { max_number: new_max_number }).exec(function(err, max_num_up) 
                                                                {
                                                                    if (err)
                                                                    {
                                                                        req.addFlash('error', 'Ha ocurrido un error editando el monto total, por favor informe del error a soporte técnico.');
                                                                        res.redirect('/admin');
                                                                    }
                                                                    else
                                                                    {
                                                                        user_transaction = { email: user.email, name: user.name, num_of_cot: transaction.numOfCOT, status: transaction_up[0].status };
                                                                        mailer.sendTransactionEmail(user_transaction, req.session.language, function(err, message_mail)
                                                                        {
                                                                            req.addFlash(message_mail.type, message_mail.message);
                                                                            res.redirect('/admin');
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else
                                    {
                                        Transactions.update({ id: [id, transaction_vinculate.id] }, { status: status }).exec(function (err, transaction_up)
                                        {
                                            if (err)
                                            {
                                                req.addFlash('error', 'Ha ocurrido un error editando el estado de la transacción, por favor intente de nuevo.');
                                                res.redirect('/admin');
                                            }
                                            else
                                            {
                                                User.find({ id: [transaction.owner, transaction_vinculate.owner] }).exec(function (err, users)
                                                {
                                                    if (err)
                                                    {
                                                        req.addFlash('error', 'Ha ocurrido un error editando el monto del usuario, por favor intente de nuevo.');
                                                        res.redirect('/admin');
                                                    }
                                                    else
                                                    {
                                                        Max_num_of_cot.findOne({ id: 1 }).exec(function (err, num_Of_COT)
                                                        {
                                                            if (err)
                                                            {
                                                                if (req.session.language == 'spanish')
                                                                    req.addFlash('error', 'Ha ocurrido un error, por favor intente de nuevo.');
                                                                else
                                                                    req.addFlash('error', 'An error has occurred, please try again.');
                                                                res.redirect('/ico');
                                                            }
                                                            else
                                                            {
                                                                if (transaction_up[0].status == 2)
                                                                {
                                                                    new_max_number = (Math.round(parseFloat(num_Of_COT.max_number) * 10000000) - Math.round(parseFloat(transaction.numOfCOT) * 10000000) -  Math.round(parseFloat(transaction_vinculate.numOfCOT) * 10000000)) / 10000000;
                                                                    if (users[0].id == transaction.owner)
                                                                        amount = (Math.round(parseFloat(users[0].number_of_COT) * 10000000) + Math.round(parseFloat(transaction.numOfCOT) * 10000000)) / 10000000;
                                                                    else
                                                                        amount = (Math.round(parseFloat(users[1].number_of_COT) * 10000000) + Math.round(parseFloat(transaction.numOfCOT) * 10000000)) / 10000000;
                                                                    if (users[0].id == transaction_vinculate.owner)
                                                                        amount_investor = (Math.round(parseFloat(users[0].number_of_COT) * 10000000) + Math.round(parseFloat(transaction_vinculate.numOfCOT) * 10000000)) / 10000000;
                                                                    else
                                                                        amount_investor = (Math.round(parseFloat(users[1].number_of_COT) * 10000000) + Math.round(parseFloat(transaction_vinculate.numOfCOT) * 10000000)) / 10000000;
                                                                }
                                                                else
                                                                {
                                                                    new_max_number = (Math.round(parseFloat(num_Of_COT.max_number) * 10000000) + Math.round(parseFloat(transaction.numOfCOT) * 10000000) +  Math.round(parseFloat(transaction_vinculate.numOfCOT) * 10000000)) / 10000000;
                                                                    if (users[0].id == transaction.owner)
                                                                        amount = (Math.round(parseFloat(users[0].number_of_COT) * 10000000) - Math.round(parseFloat(transaction.numOfCOT) * 10000000)) / 10000000;
                                                                    else
                                                                        amount = (Math.round(parseFloat(users[1].number_of_COT) * 10000000) - Math.round(parseFloat(transaction.numOfCOT) * 10000000)) / 10000000;
                                                                    if (users[0].id == transaction_vinculate.owner)
                                                                        amount_investor = (Math.round(parseFloat(users[0].number_of_COT) * 10000000) - Math.round(parseFloat(transaction_vinculate.numOfCOT) * 10000000)) / 10000000;
                                                                    else
                                                                        amount_investor = (Math.round(parseFloat(users[1].number_of_COT) * 10000000) - Math.round(parseFloat(transaction_vinculate.numOfCOT) * 10000000)) / 10000000;
                                                                }

                                                                User.update({ id: transaction.owner }, { number_of_COT: amount }).exec(function (err, user_up)
                                                                {
                                                                    if (err)
                                                                    {
                                                                        req.addFlash('error', 'Ha ocurrido un error editando el monto del usuario, por favor intente de nuevo.');
                                                                        res.redirect('/admin');
                                                                    }
                                                                    else
                                                                    {
                                                                        User.update({ id: transaction_vinculate.owner }, { number_of_COT: amount_investor }).exec(function (err, user_up)
                                                                        {
                                                                            if (err)
                                                                            {
                                                                                req.addFlash('error', 'Ha ocurrido un error editando el monto del usuario, por favor intente de nuevo.');
                                                                                res.redirect('/admin');
                                                                            }
                                                                            else
                                                                            {
                                                                                Max_num_of_cot.update({ id: 1 }, { max_number: new_max_number }).exec(function(err, max_num_up) 
                                                                                {
                                                                                    if (err)
                                                                                    {
                                                                                        req.addFlash('error', 'Ha ocurrido un error editando el monto total, por favor informe del error a soporte técnico.');
                                                                                        res.redirect('/admin');
                                                                                    }
                                                                                    else
                                                                                    {
                                                                                        user_transaction = { email: user.email, name: user.name, num_of_cot: transaction.numOfCOT, status: transaction_up[0].status };
                                                                                        mailer.sendTransactionEmail(user_transaction, req.session.language, function(err, message_mail)
                                                                                        {
                                                                                            req.addFlash(message_mail.type, message_mail.message);
                                                                                            res.redirect('/admin');
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                            else
                            {
                                Transactions.update({ id: id }, { status: status }).exec(function (err, transaction_up)
                                {
                                    if (err)
                                    {
                                        req.addFlash('error', 'Ha ocurrido un error editando el estado de la transacción, por favor intente de nuevo.');
                                        res.redirect('/admin');
                                    }
                                    else
                                    {
                                        Max_num_of_cot.findOne({ id: 2 }).exec(function (err, num_Of_COT)
                                        {
                                            if (err)
                                            {
                                                if (req.session.language == 'spanish')
                                                    req.addFlash('error', 'Ha ocurrido un error, por favor intente de nuevo.');
                                                else
                                                    req.addFlash('error', 'An error has occurred, please try again.');
                                                res.redirect('/ico');
                                            }
                                            else
                                            {
                                                if (transaction_up[0].status == 2)
                                                {
                                                    new_max_number = (Math.round(parseFloat(num_Of_COT.max_number) * 10000000) - Math.round(parseFloat(transaction.numOfCOT) * 10000000)) / 10000000;
                                                    amount = (Math.round(parseFloat(user.number_of_COT) * 10000000) + Math.round(parseFloat(transaction.numOfCOT) * 10000000)) / 10000000;
                                                }
                                                else
                                                {
                                                    new_max_number = (Math.round(parseFloat(num_Of_COT.max_number) * 10000000) + Math.round(parseFloat(transaction.numOfCOT) * 10000000)) / 10000000;
                                                    amount = (Math.round(parseFloat(user.number_of_COT) * 10000000) - Math.round(parseFloat(transaction.numOfCOT) * 10000000)) / 10000000;
                                                }

                                                User.update({ id: transaction.owner }, { number_of_COT: amount }).exec(function (err, user_up)
                                                {
                                                    if (err)
                                                    {
                                                        req.addFlash('error', 'Ha ocurrido un error editando el monto del usuario, por favor intente de nuevo.');
                                                        res.redirect('/admin');
                                                    }
                                                    else
                                                    {
                                                        Max_num_of_cot.update({ id: 2 }, { max_number: new_max_number }).exec(function(err, max_num_up) 
                                                        {
                                                            if (err)
                                                            {
                                                                req.addFlash('error', 'Ha ocurrido un error editando el monto total, por favor informe del error a soporte técnico.');
                                                                res.redirect('/admin');
                                                            }
                                                            else
                                                            {
                                                                user_transaction = { email: user.email, name: user.name, num_of_cot: transaction.numOfCOT, status: transaction_up[0].status };
                                                                mailer.sendTransactionEmail(user_transaction, req.session.language, function(err, message_mail)
                                                                {
                                                                    req.addFlash(message_mail.type, message_mail.message);
                                                                    res.redirect('/admin');
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
                else
                {
                    req.addFlash('info', 'Estado de la transacción editado correctamente.');
                    res.redirect('/admin');
                }
            }
        });
    },

    destroy: function(req,res)
    {
        var id;
        
        id = req.param('id');

        Transactions.destroy({ id_vinculate: id }).exec(function (err)
        {
            if (err)
            {
                req.addFlash('error', 'Ha ocurrido un error eliminando la transacción, por favor intente de nuevo.');
                res.redirect('/admin');
            }
            else
            {
                Transactions.destroy({ id: id }).exec(function (err)
                {
                    if (err)
                    {
                        req.addFlash('error', 'Ha ocurrido un error eliminando la transacción, por favor intente de nuevo.');
                        res.redirect('/admin');
                    }
                    else
                    {
                        req.addFlash('info', 'Transacción eliminada correctamente.');
                        res.redirect('/admin');
                    }
                });
            }
        });
    },
};

